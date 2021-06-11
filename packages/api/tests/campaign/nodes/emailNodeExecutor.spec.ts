import { expect } from "chai";
import { CampaignNodeKind } from "common/campaign";
import EmailCampaignNode from "common/campaign/nodes/emailCampaignNode";
import App from "src/app";
import Campaign, { CampaignStateEnum } from "src/models/campaign.model";
import CampaignNode from "src/models/campaignNode.model";
import CampaignNodeState from "src/models/campaignNodeState.model";
import Email from "src/models/email.model";
import Event from "src/models/event.model";
import ProductUser from "src/models/productUser.model";
import User from "src/models/user.model";
import { ExecutionResultEnum } from "src/services/campaigns/executionResult";
import EmailNodeExecutor from "src/services/campaigns/nodes/emailNodeExecutor";
import campaignSeed from "tests/seeds/campaign.seed";
import emailSeed from "tests/seeds/email.seed";
import EventSeed from "tests/seeds/event.seed";
import productUserSeed from "tests/seeds/productUser.seed";
import userSeed from "tests/seeds/user.seed";

let app: App;
let user: User;
let productUser: ProductUser;
let campaign: Campaign;
let event: Event;
let email: Email;

describe("emailNodeExecutor", function () {
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
    email = await emailSeed({
      userId: user.id,
    });
  });

  it("should send an email to a ProductUser", async () => {
    let campaignNode: CampaignNode;
    let campaignNodeState: CampaignNodeState;

    campaignNode = await CampaignNode.create({
      campaignId: campaign.id,
      userId: user.id,
      kind: CampaignNodeKind.Email,
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
    const emailCampaignNode = EmailCampaignNode.new(email.id).setName(
      email.subject
    );
    const emailNodeExecutor = new EmailNodeExecutor(app, emailCampaignNode);
    const result = await emailNodeExecutor.execute(campaignNodeState);
    expect(result.result).to.eq(ExecutionResultEnum.Continue);
    expect(result.data.html).to.equal(email.bodyHtml);
    expect(result.data.subject).to.eq(email.subject);
    expect(result.data.to).to.eq(productUser.email);
  });
});
