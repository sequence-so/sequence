import BeeQueue from "bee-queue";

export type QueueConfig = BeeQueue.QueueSettings;

// interface QueueConfig extends Omit<BeeQueue.QueueSettings, "redis"> {
//   redis: ClientOpts;
// }

const queueConfig: QueueConfig = {
  prefix: "sequence",
  redis: {
    host: process.env.REDIS_HOST,
    port: parseInt(process.env.REDIS_PORT) || 6379,
    password: process.env.REDIS_PASSWORD,
  },
  isWorker: true,
};

export default queueConfig;
