import App from "src/app";
import AudienceRepository from "./audienceRepository";
import CampaignRepository from "./campaign.repository";
import CampaignNodeRepository from "./campaignNode.repository";

export default class Repositories {
  audienceRepository: AudienceRepository;
  campaignNodeRepository: CampaignNodeRepository;
  campaignRepository: CampaignRepository;
  constructor(app: App) {
    this.audienceRepository = new AudienceRepository(app);
    this.campaignNodeRepository = new CampaignNodeRepository(app);
    this.campaignRepository = new CampaignRepository(app);
  }
}
