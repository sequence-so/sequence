import { FilterCampaignNodeJson } from "campaign/deserialize";
import { Condition } from "filters";
import { CampaignNodeKind, WaitType } from "../types";
import BaseAudienceCampaignNode from "./baseAudienceCampaignNode";

/**
 * Campaign node that filters the set of users by the given Filter Condition.
 */
class FilterCampaignNode extends BaseAudienceCampaignNode {
  kind = CampaignNodeKind.Filter;
  #waitType?: WaitType;
  #waitValue?: number;
  json?: FilterCampaignNodeJson;
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
    return new FilterCampaignNode(filter);
  }
  setWaitType(waitType: WaitType) {
    this.#waitType = waitType;
    return this;
  }
  getWaitType() {
    return this.#waitType;
  }
  setWaitValue(waitValue: number) {
    this.#waitValue = waitValue;
    return this;
  }
  getWaitValue() {
    return this.#waitValue;
  }
}

export default FilterCampaignNode;
