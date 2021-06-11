import { QueueJob } from "src/queue";
import { getNamespace } from "continuation-local-storage";
import App from "src/app";

export const queueable = (job: QueueJob) => {
  const ns = getNamespace("sequence");
  const app = ns.get("app") as App;
  const queue = app.getQueue();
};
