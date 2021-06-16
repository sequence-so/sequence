import { AudienceNodeJson } from "campaign/deserialize";
import { Condition } from "filters";
import { CampaignNodeKind } from "../types";
import BaseAudienceCampaignNode from "./baseAudienceCampaignNode";

/**
 * Campaign node that uses a pre-existing Audience as a trigger for a Campaign.
 */
class AudienceCampaignNode extends BaseAudienceCampaignNode {
  kind = CampaignNodeKind.Audience;
  json?: AudienceNodeJson;
  private constructor(filter?: Condition) {
    super();
    this.filter = filter;
    Object.defineProperty(this, "kind", {
      configurable: false,
      enumerable: true,
      value: this.kind,
      writable: false,
    });
  }
  static new(filter?: Condition) {
    return new AudienceCampaignNode(filter);
  }
}

export default AudienceCampaignNode;
