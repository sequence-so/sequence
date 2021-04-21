import { Sequelize } from "sequelize-typescript";

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

export default sequelize;
