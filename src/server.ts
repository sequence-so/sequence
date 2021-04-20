import express from "express";
import dotenv from "dotenv";
import { Sequelize } from "sequelize-typescript";

dotenv.config();

const sequelizeOpts = {
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
};
const sequelize = new Sequelize(
  process.env.DATABASE_URL,
  process.env.NODE_ENV === "development" ||
  process.env.NODE_ENV === "production"
    ? sequelizeOpts
    : {}
);

const app = express();

app.get("/", (req, res) => res.send("Hello World!"));

app.listen(process.env.PORT, () =>
  console.log("Example app listening on port 3000!")
);

(async () => {
  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
})();
