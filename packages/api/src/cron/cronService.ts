import App from "src/app";
import logger from "src/utils/logger";
import CronJob from "./cronJob";

class CronService {
  app: App;
  jobs: CronJob[];
  constructor(app: App) {
    this.app = app;
    this.jobs = [];
  }
  registerJob(job: CronJob) {
    this.jobs.push(job);
    job.app = this.app;
  }
  registerJobs(...jobs: CronJob[]) {
    jobs.forEach((job) => this.registerJob(job));
  }
  /**
   * Execute all registered jobs.
   */
  async tick() {
    logger.info(`[CronService:runJobs] Runner started`);
    const promises = this.jobs.map(async (job) => {
      logger.info(`[CronService:runJobs] Running job ${job.name}`);
      let result;
      try {
        result = await job.tick();
      } catch (error) {
        logger.error(
          `[CronService:runJobs] Caught an error while running ${job.name}:` +
            error
        );
        logger.error(error.stack);
        return error;
      }
      logger.info(`[CronService:runJobs] Finished running job ${job.name}`);
      return result;
    });
    const tickResults = await Promise.all(promises);
    logger.info(`[CronService:runJobs] Runner ended`);
    return tickResults;
  }
}

export default CronService;
