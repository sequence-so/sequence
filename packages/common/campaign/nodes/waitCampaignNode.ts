import { WaitCampaignNodeJson } from "campaign/deserialize";
import { CampaignNodeKind } from "../types";
import AbstractCampaignNode from "./abstractCampaignNode";

/**
 * Campaign Node for waiting for a specific number of days, delaying a User's progress
 * through a Campaign.
 */
class WaitCampaignNode extends AbstractCampaignNode {
  kind = CampaignNodeKind.Wait;
  #days?: number;
  json?: WaitCampaignNodeJson;
  private constructor(days?: number) {
    super();
    this.#days = days;
    Object.defineProperty(this, "kind", {
      configurable: false,
      enumerable: true,
      value: this.kind,
      writable: false,
    });
  }
  static new(days?: number) {
    return new WaitCampaignNode(days);
  }
  setDays(days: number) {
    this.#days = days;
    return this;
  }
  getDays() {
    return this.#days;
  }
}

export default WaitCampaignNode;
