import { expect } from "chai";
import App from "src/app";
import { CronJob, CronService } from "src/cron";

let app: App;
let cronService: CronService;

class EmptyCronJob extends CronJob<{ done: number }> {
  name = "EmptyCronJob";
  async tick() {
    return Promise.resolve({ done: 1 });
  }
}
class ErrorCronJob extends CronJob {
  name = "ErrorCronJob";
  async tick() {
    throw new Error("A fatal error occured");
  }
}

describe("cronService", function () {
  before(async () => {
    app = new App();
    cronService = new CronService(app);
  });
  it("should add jobs", () => {
    cronService.registerJob(new EmptyCronJob());
    expect(cronService.jobs[0].name).to.equal(EmptyCronJob.name);
  });
  it("should execute the jobs", async () => {
    const results = await cronService.tick();
    expect(results).to.not.be.undefined;
    expect(results.length).to.eq(1);
    expect(results[0]).to.deep.eq({ done: 1 });
  });
  it("should catch job errors and continue execution", async () => {
    cronService = new CronService(app);
    cronService.registerJobs(new ErrorCronJob(), new EmptyCronJob());
    const results = await cronService.tick();
    expect(results[0]).to.be.an("error");
    expect(results[1]).to.deep.equal({ done: 1 });
  });
});
