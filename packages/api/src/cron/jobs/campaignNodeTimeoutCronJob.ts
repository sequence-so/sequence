import CronJob from "../cronJob";

class CampaignNodeTimeoutJob extends CronJob {
  name = "Campaign Node Timeout Job";
  async tick() {}
}

export default CampaignNodeTimeoutJob;
