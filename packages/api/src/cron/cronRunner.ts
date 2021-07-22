import NodeCron from "node-cron";
import logger from "src/utils/logger";
const EVERY_MINUTE = "* * * * *";
const EVERY_HOUR = "0 * * * *";

class CronRunner {
  everyMinute(handler: () => void): void {
    logger.info("[CronRunner:everyMinute] Starting a cron runner...");
    NodeCron.schedule(EVERY_MINUTE, handler);
  }
  everyHour(handler: () => void): void {
    logger.info("[CronRunner:everyHour] Starting a cron runner...");
    NodeCron.schedule(EVERY_HOUR, handler);
  }
}

export default CronRunner;
