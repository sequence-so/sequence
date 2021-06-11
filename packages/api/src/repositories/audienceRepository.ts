import App from "src/app";
import { AudienceCreationAttributes } from "src/models/audience.model";
import AbstractRepository from "./abstractRepository";

class AudienceRepository extends AbstractRepository {
  constructor(app: App) {
    super(app);
  }
  createAudience(creationAttributes: AudienceCreationAttributes) {
    // this.app.models.Audience.create({});
  }
  getAudience(audienceId: string, userId: string) {
    return this.app.models.Audience.findOne({
      where: {
        id: audienceId,
        userId,
      },
    });
  }
}

export default AudienceRepository;
