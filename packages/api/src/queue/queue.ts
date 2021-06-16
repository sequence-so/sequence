import BeeQueue from "bee-queue";
import redis, { RedisClient } from "redis";
import RedisConfig from "src/config/redis";
import QueueHandler from "./queueHandler";

class Queue {
  redis: RedisClient;
  queues: BeeQueue[];
  constructor() {
    if (!process.env.REDIS_URL) {
      throw new Error("No redis found");
    }
    this.redis = redis.createClient(process.env.REDIS_URL);
  }
  createQueue(name: string, handler: QueueHandler) {
    const newQueue = new BeeQueue(name, { ...RedisConfig, redis: this.redis });
    newQueue.process.call(newQueue, handler.process);
    this.queues.push(newQueue);
  }
}

export default Queue;
