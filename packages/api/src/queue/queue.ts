import BeeQueue, { QueueSettings as BeeQueueClientOpts } from "bee-queue";
import redis, { ClientOpts as RedisClientOpts, RedisClient } from "redis";
import QueueJob from "./queueJob";
import logger from "src/utils/logger";

import QueueHandler from "./queueHandler";

type QueueConstructorArgs = {
  redisOpts: RedisClient | RedisClientOpts;
  queueOpts: BeeQueueClientOpts;
};

class Queue {
  #redis: RedisClient;
  queues: BeeQueue[];
  #redisOpts: RedisClient | RedisClientOpts;
  #queueOpts: BeeQueueClientOpts;
  constructor(args: QueueConstructorArgs) {
    this.#redisOpts = args.redisOpts;
    this.#queueOpts = args.queueOpts;
    this.queues = [];
    if (
      this.#redisOpts &&
      (this.#redisOpts as any).constructor !== "undefined"
    ) {
      this.#redis = this.#redisOpts as RedisClient;
    } else {
      this.#redis = redis.createClient(this.#redisOpts as RedisClientOpts);
    }
  }
  async createQueue<T extends QueueJob>(handler: QueueHandler<T>) {
    const newQueue = new BeeQueue(handler.name, {
      ...this.#queueOpts,
      redis: this.#redis,
    });
    await newQueue.ready();
    newQueue.process.call(newQueue, handler.process);
    newQueue.on("error", (err) => {
      logger.error(`[Queue] An error has occured ${err.message}`);
    });
    this.queues.push(newQueue);
    return newQueue;
  }
  getRedis() {
    return this.#redis;
  }
}

export default Queue;
