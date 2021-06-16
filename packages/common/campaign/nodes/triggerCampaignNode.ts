import { TriggerCampaignNodeJson } from "campaign/deserialize";
import { Condition } from "filters";
import { CampaignNodeKind } from "../types";
import BaseAudienceCampaignNode from "./baseAudienceCampaignNode";

/**
 * Campaign node that defines a campaign trigger from the Audience.
 */
class TriggerCampaignNode extends BaseAudienceCampaignNode {
  kind = CampaignNodeKind.Trigger;
  json?: TriggerCampaignNodeJson;
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
    return new TriggerCampaignNode(filter);
  }
}

export default TriggerCampaignNode;
