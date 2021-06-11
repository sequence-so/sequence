import Application from "src/app";
import CampaignCronJob from "src/cron/jobs/campaignCronJob";
import CampaignNodeTimeoutJob from "src/cron/jobs/campaignNodeTimeoutCronJob";
import CronRunner from "src/cron/cronRunner";
import appConfig from "src/config/appConfig";

const app = new Application(appConfig);
const runner = new CronRunner();
app.getCron().registerJobs(new CampaignCronJob(), new CampaignNodeTimeoutJob());

runner.everyMinute(() => {
  app.getCron().tick();
});
