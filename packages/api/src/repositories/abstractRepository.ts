import App from "src/app";
import { SequelizeModels } from "src/models";

abstract class AbstractRepository {
  app: App;
  models: SequelizeModels;
  constructor(app: App) {
    this.app = app;
    this.models = app.models;
  }
}

export default AbstractRepository;
