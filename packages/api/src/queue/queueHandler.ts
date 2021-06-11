import QueueJob from "./queueJob";

abstract class QueueHandler<T extends QueueJob> {
  name: string;
  abstract process(job: T): Promise<any>;
}

export default QueueHandler;
