import BeeQueue from "bee-queue";
import QueueHandler from "../queueHandler";

class CampaignQueueHandler extends QueueHandler<any> {
  name: "campaign_runner";
  process(job: any) {
    return Promise.resolve("done");
  }
}

export default CampaignQueueHandler;
