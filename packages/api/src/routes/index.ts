import { Application } from "express";
import Passport from "./passport.http";
import Segment from "./segment.http";
import SequenceWebhook from "./sequenceWebhook.http";
import MiddlewareRegistry from "../services/middleware.registry";

class HttpRoutes {
  constructor(app: Application) {
    MiddlewareRegistry.addMiddleware(new Passport(app));
    MiddlewareRegistry.addMiddleware(new Segment(app));
    MiddlewareRegistry.addMiddleware(new SequenceWebhook(app));
  }
}

export default HttpRoutes;
