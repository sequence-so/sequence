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
  logging: process.env.DB_LOGGING === "true" ? console.log : false,
};

const config =
  SequelizeConfig[process.env.NODE_ENV as ENVIRONMENT] ||
  SequelizeConfig.development;

export const dbConfig = config;
let sequelize: Sequelize;
if (dbConfig.url) {
  sequelize = new Sequelize(dbConfig.url, { ...(config as any), ...options });
} else {
  sequelize = new Sequelize({ ...(config as any), ...options });
}

export default sequelize;
