import Application from "src/app";
import CampaignCronJob from "src/cron/campaignCronJob";
import CampaignNodeTimeoutJob from "src/cron/campaignNodeTimeoutCronJob";

const app = new Application();
const cron = app.cron;
cron.registerJob(new CampaignCronJob());
cron.registerJob(new CampaignNodeTimeoutJob());
cron.runJobs();
