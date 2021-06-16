import App, { AppOptions } from "src/app";
import AbstractEmailProvider from "./providers/abstractEmailProvider";
import MailgunEmailProvider from "./providers/mailgunEmailProvider";
import SendgridEmailProvider from "./providers/sendgridEmailProvider";
import MockEmailProvider from "./providers/mockEmailProvider";

class EmailService {
  app: App;
  options: AppOptions["email"];
  #provider: AbstractEmailProvider;
  constructor(app: App, options?: AppOptions["email"]) {
    this.app = app;
    this.options = options;
    if (options?.mailgun) {
      this.#provider = new MailgunEmailProvider(this.options.mailgun);
    } else if (options?.sendgrid) {
      this.#provider = new SendgridEmailProvider(this.options.sendgrid);
    } else {
      this.#provider = new MockEmailProvider();
    }
  }
  getProvider() {
    return this.#provider;
  }
}

export default EmailService;
