import WaitCampaignNode from "common/campaign/nodes/waitCampaignNode";
import App from "src/app";
import CampaignNodeState from "src/models/campaignNodeState.model";
import ExecutionResult, { ExecutionResultEnum } from "../executionResult";
import AbstractNodeExecutor from "./abstractNodeExecutor";

class WaitNodeExecutor extends AbstractNodeExecutor<any> {
  node: WaitCampaignNode;
  constructor(app: App, node: WaitCampaignNode) {
    super(app, node);
  }
  async execute(_: CampaignNodeState) {
    return new ExecutionResult(ExecutionResultEnum.Continue);
  }
}

export default WaitNodeExecutor;
