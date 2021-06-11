import { expect } from "chai";
import { stub } from "sinon";
import App from "src/app";
import { QueueJob } from "src/queue";
import QueueHandler from "src/queue/queueHandler";
import { queueable } from "src/utils/queueable";

let app: App;

class EmptyJob extends QueueJob {
  name: "Empty Job";
  queue: "my_queue";
}

class EmptyJobHandler extends QueueHandler<EmptyJob> {
  name: "my_queue";
  process(job: EmptyJob): Promise<{ done: number }> {
    return Promise.resolve({ done: 1 });
  }
}

describe.skip("queue service", function () {
  before(async () => {
    app = new App();
  });
  after(async () => {
    return app.getQueue().disconnect();
  });
  it("should enqueue and process a job", async () => {
    const handler = new EmptyJobHandler();
    const resolve = async () => Promise.resolve({ done: 1 });
    stub(handler, "process").callsFake(resolve);
    const promise = new Promise(resolve);
    const queueService = app.getQueue();
    await queueService.addQueue(handler);
    await queueService.pushJob(new EmptyJob());
    expect(promise).to.eventually.deep.eq({ done: 1 });
  });
});

describe.skip("queueable", () => {
  it("should allow for queueing items using queueable", async () => {
    const handler = new EmptyJobHandler();
    const resolve = async () => Promise.resolve({ done: 1 });
    stub(handler, "process").callsFake(resolve);
    const promise = new Promise(resolve);
    await app.getQueue().addQueue(handler);
    app.cls(() => {
      queueable(new EmptyJob());
    });
    expect(promise).to.eventually.deep.eq({ done: 1 });
  });
});
