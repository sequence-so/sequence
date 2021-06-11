declare module "passport-jwt-cookiecombo";
declare module "passport-local";
declare module "jsonwebtoken";
declare module "cookie-parser";
declare module "jsonwebtoken";
declare module "passport-jwt-cookiecombo";
// declare module "*";

import { SequelizeOptions } from "sequelize-typescript";
declare module "src/config/config.js" {
  export = {
    development: SequelizeOptions,
    local: SequelizeOptions,
    production: SequelizeOptions,
  };
}
