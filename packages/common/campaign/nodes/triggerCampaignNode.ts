import { CampaignAudienceRules, CampaignNodeKind } from "../types";
import BaseAudienceCampaignNode from "./baseAudienceCampaignNode";

/**
 * Campaign node that defines a campaign trigger from the Audience.
 */
class TriggerCampaignNode extends BaseAudienceCampaignNode {
  kind = CampaignNodeKind.Trigger;
  #audienceRules: CampaignAudienceRules;
  private constructor(audienceId?: string) {
    super();
    this.audienceId = audienceId;
    Object.defineProperty(this, "kind", {
      configurable: false,
      enumerable: true,
      value: this.kind,
      writable: false,
    });
  }
  static new(audienceId?: string) {
    return new TriggerCampaignNode(audienceId);
  }
  setAudienceRules(audienceRules: CampaignAudienceRules) {
    this.#audienceRules = audienceRules;
    return this.#audienceRules;
  }
  getAudienceRules() {
    return this.#audienceRules;
  }
}

export default TriggerCampaignNode;
