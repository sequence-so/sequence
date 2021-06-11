import { expect } from "chai";
import { CampaignNodeKind } from "common/campaign";
import FilterCampaignNode from "common/campaign/nodes/filterCampaignNode";
import {
  AttributeFilter,
  Condition,
  EventFilter,
  serialize,
} from "common/filters";
import App from "src/app";
import Audience from "src/models/audience.model";
import Campaign, { CampaignStateEnum } from "src/models/campaign.model";
import CampaignNode from "src/models/campaignNode.model";
import CampaignNodeState from "src/models/campaignNodeState.model";
import Event from "src/models/event.model";
import ProductUser from "src/models/productUser.model";
import User from "src/models/user.model";
import { ExecutionResultEnum } from "src/services/campaigns/executionResult";
import FilterNodeExecutor from "src/services/campaigns/nodes/filterNodeExecutor";
import campaignSeed from "tests/seeds/campaign.seed";
import EventSeed from "tests/seeds/event.seed";
import productUserSeed from "tests/seeds/productUser.seed";
import userSeed from "tests/seeds/user.seed";

let app: App;
let user: User;
let productUser: ProductUser;
let campaign: Campaign;
let event: Event;

describe("filterNodeExecutor", function () {
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

  it("should remove non-matching ProductUsers", async () => {
    let audience: Audience;
    let campaignNode: CampaignNode;
    let campaignNodeState: CampaignNodeState;
    const condition = Condition.and(
      AttributeFilter.new("lastName", "Clancy"),
      // Note: HAS NOT been performed!
      EventFilter.new("Infiltrated the Building").hasNotBeenPerformed()
    );
    const serialized = JSON.stringify(serialize(condition));
    audience = await Audience.create({
      name: "Rainbow 6 Team",
      node: serialized,
      userId: user.id,
    });
    campaignNode = await CampaignNode.create({
      campaignId: campaign.id,
      userId: user.id,
      kind: CampaignNodeKind.Filter,
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

    const filterNode = FilterCampaignNode.new().setAudienceId(audience.id);
    const executor = new FilterNodeExecutor(app, filterNode);
    const result = await executor.execute(campaignNodeState);
    expect(result.result).to.eq(ExecutionResultEnum.End);
  });

  it("should continue with the campaign on a filter match", async () => {
    let audience: Audience;
    let campaignNode: CampaignNode;
    let campaignNodeState: CampaignNodeState;
    const condition = Condition.and(
      AttributeFilter.new("lastName", "Clancy"),
      // Note: HAS BEEN performed!
      EventFilter.new("Infiltrated the Building").hasBeenPerformed()
    );
    const serialized = JSON.stringify(serialize(condition));
    audience = await Audience.create({
      name: "Other Audience",
      node: serialized,
      userId: user.id,
    });
    campaignNode = await CampaignNode.create({
      campaignId: campaign.id,
      userId: user.id,
      kind: CampaignNodeKind.Filter,
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

    const filterNode = FilterCampaignNode.new().setAudienceId(audience.id);
    const executor = new FilterNodeExecutor(app, filterNode);
    const result = await executor.execute(campaignNodeState);
    expect(result.result).to.eq(ExecutionResultEnum.Continue);
  });
});
