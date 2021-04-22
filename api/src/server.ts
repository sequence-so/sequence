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

app.use(cookieParser(process.env.JWT_SECRET_KEY));

app.get("/", (req, res) => res.send("Hello World!"));

app.listen(process.env.PORT, () =>
  console.log("Example app listening on port 3000!")
);

let models: any;
(async () => {
  models = await buildModels();
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
