import { Sequelize, SequelizeOptions } from "sequelize-typescript";
import SequelizeConfig from "./config/config";

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

const createSequelize = (...args: any[]) => {
  const instance = new Sequelize(...args);
  instance
    .authenticate()
    .then(() => console.log("Sequence: database connection successful"))
    .catch(() => {
      console.log(
        `Environment variable DB_SSL=true required to connect to this database.`
      );
    });
  return instance;
};

let sequelize: Sequelize;
if (dbConfig.url) {
  sequelize = createSequelize(dbConfig.url, { ...(config as any), ...options });
} else {
  sequelize = createSequelize({ ...(config as any), ...options });
}

export default sequelize;
