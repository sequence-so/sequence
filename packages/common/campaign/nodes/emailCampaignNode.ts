import { EmailCampaignNodeJson } from "campaign/deserialize";
import { CampaignEmailScheduling, CampaignNodeKind } from "../types";
import AbstractCampaignNode from "./abstractCampaignNode";

/**
 * Campaign node that sends an email to the matched ProductUser.
 */
class EmailCampaignNode extends AbstractCampaignNode {
  kind = CampaignNodeKind.Email;
  #emailId?: string;
  #originalTemplateId?: string;
  #scheduling?: CampaignEmailScheduling;
  json?: EmailCampaignNodeJson;
  private constructor(emailId?: string) {
    super();
    this.#emailId = emailId;
    Object.defineProperty(this, "kind", {
      configurable: false,
      enumerable: true,
      value: this.kind,
      writable: false,
    });
  }
  static new(emailId?: string) {
    return new EmailCampaignNode(emailId);
  }
  setEmailId(value?: string) {
    this.#emailId = value;
    return this;
  }
  getEmailId() {
    return this.#emailId;
  }
  setOriginalTemplateId(value?: string) {
    this.#originalTemplateId = value;
    return this;
  }
  getOriginalTemplateId() {
    return this.#originalTemplateId;
  }
  setScheduling(value?: CampaignEmailScheduling) {
    this.#scheduling = value;
    return this;
  }
  getScheduling() {
    return this.#scheduling;
  }
}

export default EmailCampaignNode;
