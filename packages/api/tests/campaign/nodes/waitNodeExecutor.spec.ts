import { expect } from "chai";
import { CampaignNodeKind } from "common/campaign";
import WaitCampaignNode from "common/campaign/nodes/waitCampaignNode";
import App from "src/app";
import Campaign, { CampaignStateEnum } from "src/models/campaign.model";
import CampaignNode from "src/models/campaignNode.model";
import CampaignNodeState from "src/models/campaignNodeState.model";
import Event from "src/models/event.model";
import ProductUser from "src/models/productUser.model";
import User from "src/models/user.model";
import { ExecutionResultEnum } from "src/services/campaigns/executionResult";
import WaitNodeExecutor from "src/services/campaigns/nodes/waitNodeExecutor";
import campaignSeed from "tests/seeds/campaign.seed";
import EventSeed from "tests/seeds/event.seed";
import productUserSeed from "tests/seeds/productUser.seed";
import userSeed from "tests/seeds/user.seed";

let app: App;
let user: User;
let productUser: ProductUser;
let campaign: Campaign;
let event: Event;

describe("waitNodeExecutor", function () {
  before(async () => {
    app = new App();
    user = await userSeed();
    productUser = await productUserSeed({
      lastName: "Clancy",
      externalId: "abc",
      userId: user.id,
    });
    event = await EventSeed({
      userId: user.id,
      personId: productUser.externalId,
      name: "Infiltrated the Building",
    });
    campaign = await campaignSeed({
      userId: user.id,
    });
  });

  it("should always continue on wait", async () => {
    let campaignNode: CampaignNode;
    let campaignNodeState: CampaignNodeState;

    campaignNode = await CampaignNode.create({
      campaignId: campaign.id,
      userId: user.id,
      kind: CampaignNodeKind.Wait,
      json: {},
    });
    campaignNodeState = await CampaignNodeState.create({
      campaignId: campaign.id,
      campaignNodeId: campaignNode.id,
      productUserId: productUser.id,
      state: CampaignStateEnum.RUNNING,
      userId: user.id,
      runAt: new Date(),
    });

    const waitNode = WaitCampaignNode.new().setDays(2);
    const executor = new WaitNodeExecutor(app, waitNode);
    const result = await executor.execute(campaignNodeState);
    expect(result.result).to.eq(ExecutionResultEnum.Continue);
  });
});
