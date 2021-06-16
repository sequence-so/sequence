abstract class Job {
  name: string;
  async run(): Promise<void> {
    return Promise.reject("Did not implement run");
  }
}

export default Job;
