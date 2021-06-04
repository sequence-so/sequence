require("dotenv").config();

const useSSL = process.env.DB_SSL === "true";

const dialectOptions = useSSL
  ? {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    }
  : {};

module.exports = {
  development: {
    url: process.env.DATABASE_URL,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    host: process.env.DB_HOST,
    dialect: "postgres",
    dialectOptions,
    migrationStorageTableName: "sequelize_meta",
  },
  test: {
    url: process.env.DATABASE_URL,
    username: process.env.DB_TEST_USERNAME,
    password: process.env.DB_TEST_PASSWORD,
    database: process.env.DB_TEST_DATABASE,
    host: process.env.DB_TEST_HOST,
    dialect: "postgres",
    dialectOptions,
    migrationStorageTableName: "sequelize_meta",
  },
  production: {
    url: process.env.DATABASE_URL,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    host: process.env.DB_HOST,
    dialect: "postgres",
    dialectOptions,
    migrationStorageTableName: "sequelize_meta",
  },
};
