import { Sequelize, SequelizeOptions } from "sequelize-typescript";
const SequelizeConfig = require("./config/config.js");

declare type ENVIRONMENT = "test" | "development" | "production";

const options: SequelizeOptions = {
  dialectOptions: process.env.DB_SSL
    ? {
        ssl: {
          require: true,
          rejectUnauthorized: false,
        },
      }
    : {},
  // logging: process.env.NODE_ENV === "local" ? true : false,
  logging: true,
};

const config =
  SequelizeConfig[process.env.NODE_ENV as ENVIRONMENT] ||
  SequelizeConfig.development;

export const dbConfig = config;
const sequelize = new Sequelize({ ...(config as any), ...options });

export default sequelize;
