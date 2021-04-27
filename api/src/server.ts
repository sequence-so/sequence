import express from "express";
import dotenv from "dotenv";
dotenv.config();

import cookieParser from "cookie-parser";
import { ApolloServer } from "apollo-server-express";
import schema from "./graphql/schema";
import resolvers from "./graphql/resolvers";
import jwt from "jsonwebtoken";
import JwtConfig from "./config/jwt";
import cors from "cors";

import buildModels from "./models/index";
import enforce from "express-sslify";

const app = express();

app.disable("x-powered-by");

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

if (process.env.USE_SSL) {
  app.use(enforce.HTTPS({ trustProtoHeader: true }));
}

app.use(
  cors({
    origin: ["https://my.sequence.so", "https://api-dev.sequence.so"],
    credentials: true,
  })
);

app.use(cookieParser(process.env.JWT_SECRET_KEY));
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

app.get("/", (req, res) => res.json({ success: true }));

app.listen(process.env.PORT, () =>
  console.log(`Application listening on port ${process.env.PORT}!`)
);

import IntercomService from "./services/intercom";
import PostgresService from "./services/postgres";
let models: any;
(async () => {
  models = await buildModels();

  // let user = await models.User.findOne({
  //   where: {
  //     id: "41ca3ac5-0c63-4249-a96c-b25fd972fcb0",
  //   },
  // });
  // let pService = new PostgresService(user);
  // await pService.connect();
  // console.log({ user });
  // let service = new IntercomService();
  // service = await service.getFromUser(user);
  // service.fetchAllContacts();
})();

import Routes from "./routes";

new Routes(app);

const server = new ApolloServer({
  typeDefs: schema,
  resolvers,
  context: ({ req }) => {
    const token = req.headers.authorization;
    const result = jwt.verify(token, JwtConfig.jwt.secret);
    const user = (result as any).user;
    return { models, user };
  },
});
server.applyMiddleware({ app });

export default app;
