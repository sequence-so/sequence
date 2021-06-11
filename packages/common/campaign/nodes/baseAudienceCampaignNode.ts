import { CampaignAudienceRules, CampaignNodeKind } from "../types";
import AbstractCampaignNode from "./abstractCampaignNode";
import { Condition } from "../../filters/index";

/**
 * Campaign node that uses a pre-existing Audience as a trigger for a Campaign.
 */
abstract class BaseAudienceCampaignNode extends AbstractCampaignNode {
  kind = CampaignNodeKind.Audience;
  audienceId?: string;
  filter?: Condition;
  audienceName?: string;
  #audienceRules?: CampaignAudienceRules;
  constructor(audienceId?: string) {
    super();
    this.audienceId = audienceId;
  }
  setAudienceId(audienceId?: string) {
    this.audienceId = audienceId;
    return this;
  }
  getAudienceId() {
    return this.audienceId;
  }
  setAudienceName(value?: string) {
    this.audienceName = value;
    return this;
  }
  getAudienceName() {
    return this.audienceName;
  }
  setFilter(filter?: Condition) {
    this.filter = filter;
    return this;
  }
  getFilter() {
    return this.filter;
  }
  setAudienceRules(audienceRules: CampaignAudienceRules) {
    this.#audienceRules = audienceRules;
    return this;
  }
  getAudienceRules() {
    return this.#audienceRules;
  }
}

export default BaseAudienceCampaignNode;
