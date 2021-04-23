import express from "express";
import dotenv from "dotenv";
dotenv.config();

import cookieParser from "cookie-parser";
import { ApolloServer } from "apollo-server-express";
import schema from "./graphql/schema";
import resolvers from "./graphql/resolvers";
import jwt from "jsonwebtoken";
import JwtConfig from "./config/jwt";

import buildModels from "./models/index";

const app = express();

app.disable("x-powered-by");

app.use(cookieParser(process.env.JWT_SECRET_KEY));
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

app.get("/", (req, res) => res.send("Hello World!"));

app.listen(process.env.PORT, () =>
  console.log("Example app listening on port 3000!")
);

import IntercomService from "./services/intercom";
let models: any;
(async () => {
  models = await buildModels();

  let user = await models.User.findOne({
    where: {
      id: "41ca3ac5-0c63-4249-a96c-b25fd972fcb0",
    },
  });
  console.log({ user });
  let service = new IntercomService();
  service = await service.getFromUser(user);
  service.fetchAllContacts();
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
