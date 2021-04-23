import { Application } from "express";
import Passport from "./passport";
import Ssl from "./ssl";
import Segment from "./segment";

class Routes {
  constructor(app: Application) {
    new Passport(app);
    new Ssl(app);
    new Segment(app);
  }
}

export default Routes;
