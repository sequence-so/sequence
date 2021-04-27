import { Sequelize, SequelizeOptions } from "sequelize-typescript";

const options: SequelizeOptions = {
  dialectOptions: process.env.DB_SSL
    ? {
        ssl: {
          require: true,
          rejectUnauthorized: false,
        },
      }
    : {},
  logging: process.env.NODE_ENV === "local" ? true : false,
};

const sequelize = new Sequelize(process.env.DATABASE_URL, options);

export default sequelize;
