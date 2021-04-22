import { Sequelize, SequelizeOptions } from "sequelize-typescript";

const sequelizeOpts: SequelizeOptions = {
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
  logging: process.env.NODE_ENV === "local" ? true : false,
};

const sequelize = new Sequelize(
  process.env.DATABASE_URL,
  process.env.NODE_ENV === "development" ||
  process.env.NODE_ENV === "production"
    ? sequelizeOpts
    : {}
);

export default sequelize;
