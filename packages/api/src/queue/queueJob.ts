abstract class QueueJob {
  /**
   * Job name.
   */
  name: string;
  /**
   * Queue name.
   */
  queue: string;
  async run(): Promise<void> {
    return Promise.reject("Did not implement run");
  }
}

export default QueueJob;
