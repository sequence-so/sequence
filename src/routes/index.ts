import { Application } from "express";
import Passport from "./passport";
import Ssl from "./ssl";

class Routes {
  constructor(app: Application) {
    new Passport(app);
    new Ssl(app);
  }
}

export default Routes;
