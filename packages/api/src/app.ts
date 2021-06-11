import dotenv from "dotenv";
dotenv.config();
import { register } from "./moduleAliases";
register();
import http from "http";
import express, { Application as ExpressApplication } from "express";
import cookieParser from "cookie-parser";
import { ApolloServer } from "apollo-server-express";
import { GraphQLRequestContext } from "apollo-server-plugin-base";
import jwt from "jsonwebtoken";
import cors from "cors";
import session from "express-session";
import enforce from "express-sslify";
import JwtConfig from "./config/jwt";
import schema from "./graphql/schema";
import Models, { SequelizeModels } from "./models/index";
import database from "./database";
import Routes from "./routes";
import resolvers from "./graphql/resolvers";
import logger from "./utils/logger";
import { GraphQLError, GraphQLFormattedError } from "graphql";
import { CronService } from "./cron";
import QueueService, { QueueServiceOptions } from "./queue/queueService";
import { createNamespace, Namespace } from "continuation-local-storage";
import Repositories from "./repositories";
import EmailService from "./services/email/emailService";
import { isIntrospectionRequest } from "./utils/isIntrospectionRequest";
import SequenceError, { HTTP_UNAUTHORIZED } from "./error/sequenceError";

export interface AppOptions {
  /**
   * Continuation local storage namespace identifier.
   */
  namespace?: string;
  /**
   * Queue options. Supply Redis options here
   */
  queue?: QueueServiceOptions;
  email?: {
    sendgrid?: {
      fromAddress: string;
      apiKey: string;
    };
    mailgun?: {
      fromAddress: string;
      apiKey: string;
      domain: string;
    };
  };
}

class App {
  expressApplication: ExpressApplication;
  apolloServer: ApolloServer;
  models: SequelizeModels;
  ns: Namespace;
  #server: http.Server;
  #cronService: CronService;
  #queueService: QueueService;
  repositories: Repositories;
  #emailService: EmailService;
  constructor(options?: AppOptions) {
    this.ns = createNamespace(options?.namespace || "sequence");
    this.expressApplication = express();
    this.configureExpress();
    this.models = Models;
    this.bootRepositories();
    this.bootRoutes();
    this.bootCron();
    this.bootApolloServer();
    // this.bootQueue(options?.queue);
    this.bootEmail(options?.email);
  }
  /**
   * Formats the error returned via the API
   * @param error GraphQL Error
   * @returns
   */
  graphQLErrorFormatter(
    error: GraphQLError
  ): GraphQLFormattedError<Record<string, any>> {
    if (
      error.extensions?.exception?.statusCode >= 400 &&
      error.extensions?.exception?.statusCode < 500
    ) {
      return {
        message: error.message,
        locations: error.locations,
        path: error.path,
      };
    }
    // Unhandled server error occured
    logger.error(
      "[App:graphQLErrorFormatter] Error occured processing GraphQL request:",
      error
    );
    logger.error(error.extensions.exception);
    return {
      message: error.message,
      locations: error.locations,
      path: error.path,
      errors: error.originalError ? (error.originalError as any).errors : null,
    } as any;
  }
  /**
   * Executes a function wrapped in a Continuation Local Storage block.
   * Used to provide req/res global state.
   *
   * @param fn Function to execute
   */
  cls(fn: () => void) {
    this.ns.run(() => {
      this.ns.set("app", this);
      fn();
    });
  }
  listen() {
    this.getExpressApplication().get("/", (req, res) =>
      res.json({ success: true })
    );
    return (this.#server = this.getExpressApplication().listen(
      process.env.PORT,
      () => console.log(`Sequence API listening on port ${process.env.PORT}`)
    ));
  }
  bootApolloServer() {
    this.expressApplication.use("/graphql", (req, res, next) => {
      this.cls(next);
    });
    const context = (context: {
      req: express.Request;
      _: express.Response;
    }) => {
      const req = context.req;
      const token = req.headers.authorization;
      let jwtVerifyResult: any;
      // Admit introspection queries if we're in development mode
      if (isIntrospectionRequest(req)) {
        if (
          token === "INTROSPECTION" &&
          process.env.NODE_ENV !== "production"
        ) {
          jwtVerifyResult = { user: { firstName: "Admin" } };
        } else {
          throw new SequenceError(
            "You are not authorized to perform this request.",
            HTTP_UNAUTHORIZED
          );
        }
      } else {
        try {
          jwtVerifyResult = jwt.verify(token, JwtConfig.jwt.secret);
        } catch (error) {
          throw new SequenceError(
            "You are not authorized to perform this request.",
            HTTP_UNAUTHORIZED
          );
        }
      }
      const user = (jwtVerifyResult as any).user;

      return {
        models: Models,
        user,
        app: this,
        repositories: this.repositories,
      };
    };
    this.apolloServer = new ApolloServer({
      typeDefs: schema,
      resolvers: resolvers,
      introspection: true,
      context: context,
      formatError: this.graphQLErrorFormatter,
    });

    this.apolloServer.applyMiddleware({
      app: this.expressApplication,
      cors: {
        origin: [
          "https://my.sequence.so",
          "https://dev.sequence.so",
          "http://localhost:8000",
          "http://0.0.0.0:8000",
        ],
        credentials: true,
      },
    });
  }
  configureExpress() {
    const app = this.expressApplication;
    app.disable("x-powered-by");

    if (process.env.USE_SSL) {
      app.use(enforce.HTTPS({ trustProtoHeader: true }));
    }

    app.use(
      cors({
        origin: [
          process.env.DASHBOARD_URL,
          "https://my.sequence.so",
          "https://dev.sequence.so",
          "http://localhost:8000",
          "http://0.0.0.0:8000",
        ],
        credentials: true,
      })
    );

    app.options("*", cors());

    app.use(cookieParser(process.env.JWT_SECRET_KEY));
    app.use(express.json());
    app.use(
      express.urlencoded({
        extended: true,
      })
    );
    app.use(
      session({
        secret: process.env.ENCRYPTION_KEY,
        resave: true,
        saveUninitialized: true,
      })
    );
  }
  close() {
    if (this.apolloServer) {
      this.apolloServer.stop();
    }
    if (this.#server) {
      this.#server.close();
    }
    database.close();
  }
  bootRoutes() {
    new Routes(this.expressApplication);
  }
  bootCron() {
    if (this.#cronService) {
      return this.#cronService;
    }
    return (this.#cronService = new CronService(this));
  }
  bootRepositories() {
    if (this.repositories) {
      return this.repositories;
    }
    return (this.repositories = new Repositories(this));
  }
  bootQueue(options?: QueueServiceOptions) {
    if (this.#queueService) {
      return this.#queueService;
    }
    return (this.#queueService = new QueueService(this, options));
  }
  bootEmail(options?: AppOptions["email"]) {
    if (this.#emailService) {
      return this.#emailService;
    }
    return (this.#emailService = new EmailService(this, options));
  }
  getCron() {
    return this.#cronService;
  }
  getQueue() {
    return this.#queueService;
  }
  getExpressApplication() {
    return this.expressApplication;
  }
  getRepositories() {
    return this.repositories;
  }
  getEmail() {
    return this.#emailService;
  }
}

export default App;
