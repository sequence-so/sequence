import AbstractEmailProvider, {
  SendEmailPayload,
} from "./abstractEmailProvider";
import logger from "src/utils/logger";

class MockEmailProvider extends AbstractEmailProvider {
  constructor() {
    super();
  }
  async send(payload: SendEmailPayload) {
    logger.info(
      "[MockEmailProvider:send] Sending with options" + JSON.stringify(payload)
    );
  }
}

export default MockEmailProvider;
