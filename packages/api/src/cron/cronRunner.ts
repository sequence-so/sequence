import NodeCron from "node-cron";
import logger from "src/utils/logger";
const EVERY_MINUTE = "* * * * *";

class CronRunner {
  everyMinute(handler: () => void) {
    logger.info("[CronRunner:everyMinute] Starting a cron runner...");
    NodeCron.schedule(EVERY_MINUTE, handler);
  }
}

export default CronRunner;
