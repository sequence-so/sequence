import BeeQueue from "bee-queue";

abstract class QueueHandler {
  abstract process(job: BeeQueue.Job<any>): Promise<void>;
}

export default QueueHandler;
