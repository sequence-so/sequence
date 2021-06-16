import dotenv from "dotenv";
dotenv.config();
import { register } from "./moduleAliases";
register();
import express, { Application as ExpressApplication } from "express";
import cookieParser from "cookie-parser";
import { ApolloServer } from "apollo-server-express";
import jwt from "jsonwebtoken";
import cors from "cors";
import session from "express-session";
import enforce from "express-sslify";
import JwtConfig from "./config/jwt";
import schema from "./graphql/schema";
import SequelizeModels from "./models/index";
import Routes from "./routes";
import resolvers from "./graphql/resolvers";
import logger from "./utils/logger";
import { GraphQLError, GraphQLFormattedError } from "graphql";
import { Cron, getInstance as getCronInstance } from "./cron/cron";

class App {
  expressApplication: ExpressApplication;
  apolloServer: ApolloServer;
  cron: Cron;
  constructor() {
    this.expressApplication = express();
    this.configureExpress();
    this.bootRoutes();
    this.bootCron();
    this.bootApolloServer();
  }
  /**
   * Formats the error returned via the API
   * @param error GraphQL Error
   * @returns
   */
  graphQLErrorFormatter(
    error: GraphQLError
  ): GraphQLFormattedError<Record<string, any>> {
    logger.error("[App] Error occured processing GraphQL request:", error);
    return {
      message: error.message,
      // code: err.originalError && err.originalError.code,
      locations: error.locations,
      path: error.path,
    };
  }
  bootApolloServer() {
    this.apolloServer = new ApolloServer({
      typeDefs: schema,
      resolvers: resolvers,
      debug: true,
      introspection: true,
      context: ({ req }) => {
        const token = req.headers.authorization;
        const result = jwt.verify(token, JwtConfig.jwt.secret);
        const user = (result as any).user;
        return {
          models: SequelizeModels,
          user,
        };
      },
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
  bootRoutes() {
    new Routes(this.expressApplication);
  }
  bootCron() {
    this.cron = getCronInstance();
  }
  getExpressApplication() {
    return this.expressApplication;
  }
}

export default App;
