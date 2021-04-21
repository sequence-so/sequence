import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
dotenv.config();

import buildModels from "./models/index";

const app = express();

app.use(cookieParser(process.env.JWT_SECRET_KEY));

app.get("/", (req, res) => res.send("Hello World!"));

app.listen(process.env.PORT, () =>
  console.log("Example app listening on port 3000!")
);

buildModels();

import Routes from "./routes";

new Routes(app);

export default app;
