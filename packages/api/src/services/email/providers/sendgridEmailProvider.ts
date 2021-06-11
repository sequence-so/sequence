import { AppOptions } from "src/app";
import Sendgrid from "@sendgrid/mail";
import AbstractEmailProvider, {
  SendEmailPayload,
} from "./abstractEmailProvider";
import invariant from "invariant";
import SequenceError from "src/error/sequenceError";
import logger from "src/utils/logger";

type SendgridOptions = AppOptions["email"]["sendgrid"];

class SendgridEmailProvider extends AbstractEmailProvider {
  apiKey: string;
  options: SendgridOptions;
  constructor(options: SendgridOptions) {
    super();
    this.options = options;
    this.apiKey = options.apiKey;
    invariant(options.fromAddress, "Must provide from address");
    Sendgrid.setApiKey(process.env.SENDGRID_API_KEY);
  }
  async send(payload: SendEmailPayload) {
    return Sendgrid.send({
      ...payload,
      from: this.options.fromAddress,
    })
      .then((data) => data)
      .catch((error) => {
        const sequenceError = new SequenceError(
          "Could not send email to Sendgrid",
          500
        );
        sequenceError.errors = error.response.body.errors;
        logger.error(
          "[SendgridEmailProvider:send] " + error.response.body.errors
        );
        throw sequenceError;
      });
  }
}

export default SendgridEmailProvider;
