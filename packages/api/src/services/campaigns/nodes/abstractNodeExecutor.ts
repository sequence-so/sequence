import App from "src/app";
import AbstractCampaignNode from "common/campaign/nodes/abstractCampaignNode";
import CampaignNodeState from "src/models/campaignNodeState.model";

abstract class AbstractNodeExecutor<T = any> {
  node: AbstractCampaignNode;
  app: App;
  constructor(app: App, node: AbstractCampaignNode) {
    this.app = app;
    this.node = node;
  }
  abstract execute(state: CampaignNodeState): Promise<T>;
}

export default AbstractNodeExecutor;
