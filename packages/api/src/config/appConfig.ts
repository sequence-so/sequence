import { AppOptions } from "src/app";
import queueConfig from "./queue.config";

const appConfig: AppOptions = {
  email: {
    sendgrid: {
      fromAddress: process.env.FROM_ADDRESS,
      apiKey: process.env.SENDGRID_API_KEY,
    },
  },
  queue: {
    queueOpts: queueConfig,
    redisOpts: {},
  },
};

export default appConfig;
