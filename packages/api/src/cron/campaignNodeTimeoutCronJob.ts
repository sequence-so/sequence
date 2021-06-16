import Job from "./job";

class CampaignNodeTimeoutJob extends Job {
  name: "Campaign Cron Job";
  async run() {}
}

export default CampaignNodeTimeoutJob;
