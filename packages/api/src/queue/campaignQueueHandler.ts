import BeeQueue from "bee-queue";
import QueueHandler from "./queueHandler";

class CampaignQueueHandler extends QueueHandler {
  process(job: BeeQueue.Job<any>) {
    return Promise.resolve();
  }
}

export default CampaignQueueHandler;
