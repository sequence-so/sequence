import FilterCampaignNode from "common/campaign/nodes/filterCampaignNode";
import { Condition, deserialize } from "common/filters";
import App from "src/app";
import { AudienceBuilder } from "src/audience";
import Audience from "src/models/audience.model";
import CampaignNodeState from "src/models/campaignNodeState.model";
import logger from "src/utils/logger";
import ExecutionResult, { ExecutionResultEnum } from "../executionResult";
import AbstractNodeExecutor from "./abstractNodeExecutor";
import CampaignNodeExecutionError from "src/error/campaignNodeExecutionError";

class FilterNodeExecutor extends AbstractNodeExecutor<any> {
  node: FilterCampaignNode;
  constructor(app: App, node: FilterCampaignNode) {
    super(app, node);
  }
  async execute(state: CampaignNodeState) {
    let audience: Audience;
    let conditionNode: Condition;
    const productUserId = state.productUserId;
    const userId = state.userId;
    const audienceId = this.node.getAudienceId();

    audience = await this.app.models.Audience.findOne({
      where: {
        id: audienceId,
        userId,
      },
    });

    if (!audience) {
      logger.error(
        `[FilterNodeExecutor:execute] FATAL: Could not find audience for id: ${this.node.getAudienceId()}`
      );
      throw new CampaignNodeExecutionError("Audience not found");
    }
    conditionNode = deserialize(JSON.parse(audience.node));

    logger.info(
      `[FilterNodeExecutor:execute] Performing filter on audienceId=${audienceId} on productUserId=${productUserId}`
    );

    const audienceBuilder = new AudienceBuilder(conditionNode, userId, {
      productUserId,
    });
    const matchedProductUsers = await audienceBuilder.build().execute();

    // If the AudienceBuilder returns a match for this node, then the ProductUser
    // continues the campaign
    if (matchedProductUsers.length === 1) {
      return new ExecutionResult(ExecutionResultEnum.Continue, {
        productUser: matchedProductUsers[0],
      });
    }

    return new ExecutionResult(ExecutionResultEnum.End);
  }
}

export default FilterNodeExecutor;
