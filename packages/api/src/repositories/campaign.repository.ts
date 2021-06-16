import App from "src/app";
import SequenceError from "src/error/sequenceError";
import { CampaignCreationAttributes } from "src/models/campaign.model";
import AbstractRepository from "./abstractRepository";

type CreateCampaignInputArgs = Omit<CampaignCreationAttributes, "userId">;

type UpdateCampaignInputArgs = CreateCampaignInputArgs & {
  id: string;
};

class CampaignRepository extends AbstractRepository {
  constructor(app: App) {
    super(app);
  }
  createCampaign(attrs: CampaignCreationAttributes) {
    return this.models.Campaign.create(attrs);
  }
  async updateCampaign(
    id: string,
    userId: string,
    attrs: UpdateCampaignInputArgs
  ) {
    const campaign = await this.models.Campaign.findOne({
      where: {
        id,
        userId,
      },
    });

    if (!campaign) {
      throw new SequenceError("No model found", 422);
    }

    return campaign.update(attrs);
  }
}

export default CampaignRepository;
