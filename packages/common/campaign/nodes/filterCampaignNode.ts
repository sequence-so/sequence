import { CampaignNodeKind } from "../types";
import BaseAudienceCampaignNode from "./baseAudienceCampaignNode";

/**
 * Campaign node that filters the set of users by the given Filter Condition.
 */
class FilterCampaignNode extends BaseAudienceCampaignNode {
  kind = CampaignNodeKind.Filter;
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
    return new FilterCampaignNode(audienceId);
  }
}

export default FilterCampaignNode;
