import CampaignQueueHandler from "src/queue/campaignQueueHandler";
import Queue from "src/queue/queue";

const queue = new Queue();
queue.createQueue("campaign-runner", new CampaignQueueHandler());
