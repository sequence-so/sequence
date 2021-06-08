import dotenv from "dotenv";
dotenv.config();
import { register } from "./moduleAliases";
register();
import express from "express";
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

const app = express();

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

new Routes(app);

const server = new ApolloServer({
  typeDefs: schema,
  resolvers: resolvers,
  context: ({ req }) => {
    const token = req.headers.authorization;
    const result = jwt.verify(token, JwtConfig.jwt.secret);
    const user = (result as any).user;
    return {
      models: SequelizeModels,
      user,
    };
  },
  formatError(err) {
    logger.error("Error occured processing request:", err);
    return {
      message: err.message,
      // code: err.originalError && err.originalError.code,
      locations: err.locations,
      path: err.path,
    };
  },
});

server.applyMiddleware({
  app,
  cors: {
    origin: [
      "https://my.sequence.so",
      "https://dev.sequence.so",
      "http://localhost:8000",
    ],
    credentials: true,
  },
});

export default app;
