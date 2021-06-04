import User from "../models/user";
import Models from "../models/index";

export type GraphQLContextType = {
  models: typeof Models;
  user: User;
  dataLoaders: {
    productUserLoader: any;
  };
};
