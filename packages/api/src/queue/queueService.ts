import App from "src/app";
import DefaultQueueConfig from "src/config/queue.config";
import { QueueJob } from "./";
import SequenceError from "src/error/sequenceError";
import CampaignQueueHandler from "./handlers/campaignQueueHandler";
import Queue from "./queue";
import QueueHandler from "./queueHandler";

export type QueueServiceOptions = {
  queueOpts: typeof DefaultQueueConfig;
  redisOpts: typeof DefaultQueueConfig.redis;
};

class QueueService {
  app: App;
  #queue: Queue;
  constructor(
    app: App,
    options: QueueServiceOptions = {
      queueOpts: DefaultQueueConfig,
      redisOpts: DefaultQueueConfig.redis,
    }
  ) {
    this.app = app;
    this.#queue = new Queue(options);
    this.registerQueues();
  }
  registerQueues() {
    this.#queue.createQueue(new CampaignQueueHandler());
  }
  async disconnect() {
    Promise.all(this.#queue.queues.map((q) => q.close()));
  }
  async addQueue<T extends QueueJob>(handler: QueueHandler<T>) {
    return this.#queue.createQueue(handler);
  }
  async pushJob(job: QueueJob) {
    const associatedQueue = this.#queue.queues.find(
      (q) => q.name === job.queue
    );
    if (!associatedQueue) {
      throw new SequenceError(
        "Could not find associated queue for Job, did you specify a `queue` attribute on your Job?",
        500
      );
    }
    return associatedQueue.createJob(job).save();
  }
}

export default QueueService;
