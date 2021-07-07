import User from "../models/user.model";
import Models from "../models/index";
import App from "src/app";
import Repositories from "src/repositories";

export type GraphQLContextType = {
  models: typeof Models;
  user: User;
  app: App;
  repositories: Repositories;
};
