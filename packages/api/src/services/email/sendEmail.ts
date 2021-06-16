import Mustache from "mustache";
import Email from "src/models/email.model";
import ProductUser from "src/models/productUser.model";
import logger from "src/utils/logger";
import AbstractEmailProvider from "./providers/abstractEmailProvider";

class SendEmail {
  provider: AbstractEmailProvider;
  productUser: ProductUser;
  email: Email;
  toAddress: string;
  setToAddress(toAddress: string) {
    this.toAddress = toAddress;
    return this;
  }
  setProductUser(productUser: ProductUser) {
    this.productUser = productUser;
    return this;
  }
  setProvider(provider: AbstractEmailProvider) {
    this.provider = provider;
    return this;
  }
  setEmail(email: Email) {
    this.email = email;
    return this;
  }
  getPayload() {
    const renderedHtml = Mustache.render(
      this.email.bodyHtml,
      this.productUser || {}
    );
    const renderedSubject = Mustache.render(
      this.email.subject,
      this.productUser || {}
    );

    return {
      html: renderedHtml,
      subject: renderedSubject,
      to: this.toAddress ? this.toAddress : this.productUser.email,
    };
  }
  async send() {
    logger.info("[SendEmail:send] Sending the email...");
    const payload = this.getPayload();
    try {
      const result = this.provider.send(payload);
      logger.info("[SendEmail:send] Sent!");
      return result;
    } catch (error) {
      logger.error(
        "[SendEmail:send] An error occurred sending the email: " + error
      );
      throw error;
    }
  }
}

export default SendEmail;
