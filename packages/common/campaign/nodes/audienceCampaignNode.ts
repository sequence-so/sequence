import { CampaignAudienceRules, CampaignNodeKind } from "../types";
import BaseAudienceCampaignNode from "./baseAudienceCampaignNode";

/**
 * Campaign node that uses a pre-existing Audience as a trigger for a Campaign.
 */
class AudienceCampaignNode extends BaseAudienceCampaignNode {
  kind: CampaignNodeKind.Audience;
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
    return new AudienceCampaignNode(audienceId);
  }
  setAudienceRules(audienceRules: CampaignAudienceRules) {
    this.#audienceRules = audienceRules;
    return this;
  }
  getAudienceRules() {
    return this.#audienceRules;
  }
}

export default AudienceCampaignNode;
