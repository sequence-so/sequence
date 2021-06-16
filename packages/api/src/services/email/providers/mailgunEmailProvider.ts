import { AppOptions } from "src/app";
import Mailgun from "mailgun-js";
import AbstractEmailProvider, {
  SendEmailPayload,
} from "./abstractEmailProvider";
import invariant from "invariant";
type MailgunOptions = AppOptions["email"]["mailgun"];

class MailgunEmailProvider extends AbstractEmailProvider {
  apiKey: string;
  domain: string;
  mailgun: Mailgun.Mailgun;
  options: MailgunOptions;
  constructor(options: MailgunOptions) {
    super();
    this.options = options;
    this.apiKey = options.apiKey;
    this.domain = options.domain;
    invariant(this.apiKey, "API Key must be provided");
    invariant(this.domain, "Domain must be provided");
    this.mailgun = Mailgun({
      apiKey: this.apiKey,
      domain: this.domain,
    });
  }
  async send(payload: SendEmailPayload) {
    return this.mailgun.messages().send({
      ...payload,
      from: this.options.fromAddress,
    });
  }
}

export default MailgunEmailProvider;
