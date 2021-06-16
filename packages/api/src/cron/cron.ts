import logger from "src/utils/logger";
import Job from "./job";

export class Cron {
  jobs: Job[];
  registerJob(job: Job) {
    this.jobs.push(job);
  }
  runJobs() {
    logger.info(`[CRON] Runner started`);
    this.jobs.forEach(async (job) => {
      logger.info(`[CRON] Running job ${job.name}`);
      await job.run();
      logger.info(`[CRON] Finished running job ${job.name}`);
    });
    logger.info(`[CRON] Runner ended`);
  }
}

let instance: Cron;
export const getInstance = () => {
  if (instance) {
    return instance;
  } else {
    instance = new Cron();
  }
};
