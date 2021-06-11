import { expect } from "chai";
import { CampaignNodeKind } from "common/campaign";
import moment from "moment";
import App from "src/app";
import Campaign, { CampaignStateEnum } from "src/models/campaign.model";
import CampaignNode from "src/models/campaignNode.model";
import CampaignNodeState, {
  CampaignNodeStateCreationAttributes,
} from "src/models/campaignNodeState.model";
import ProductUser from "src/models/productUser.model";
import User from "src/models/user.model";
import CampaignNodeRepository from "src/repositories/campaignNode.repository";
import campaignSeed from "tests/seeds/campaign.seed";
import productUserSeed from "tests/seeds/productUser.seed";
import userSeed from "tests/seeds/user.seed";

let app: App;
let repository: CampaignNodeRepository;
let campaign: Campaign;
let user: User;
let productUser: ProductUser;
let campaignNode: CampaignNode;

const createActiveCampaign = () =>
  campaignSeed({
    userId: user.id,
    state: CampaignStateEnum.RUNNING,
    isDraft: false,
  });
const createCampaignNode = () =>
  CampaignNode.create({
    campaignId: campaign.id,
    kind: CampaignNodeKind.Wait,
    userId: user.id,
    json: {},
  });
const createCampaignNodeState = (
  params: Partial<CampaignNodeStateCreationAttributes>
) =>
  CampaignNodeState.create({
    ...params,
    state: params.state,
    didTimeout: false,
    runAt: params.runAt,
    userId: user.id,
    campaignId: campaign.id,
    campaignNodeId: campaignNode.id,
    productUserId: productUser.id,
  });

describe("CampaignNodeRepository", function () {
  before(async () => {
    app = new App();
    repository = new CampaignNodeRepository(app);
    user = await userSeed();
    productUser = await productUserSeed({
      userId: user.id,
      externalId: "123",
    });
  });
  beforeEach(async () => {
    await CampaignNodeState.destroy({
      truncate: true,
    });
  });

  describe("getNextCampaignNodeStates", () => {
    it("should return 0 campaign node states for draft campaigns", async () => {
      campaign = await campaignSeed({
        userId: user.id,
        isDraft: true,
      });
      campaignNode = await createCampaignNode();
      await createCampaignNodeState({
        runAt: new Date(),
        state: CampaignStateEnum.PENDING,
        attempts: 0,
      });

      const campaignNodeStates = await repository.getNextCampaignNodeStates();
      expect(campaignNodeStates.length).to.eq(0);
    });
    it("should return 0 campaign node states for campaigns in PENDING state", async () => {
      campaign = await campaignSeed({
        userId: user.id,
        state: CampaignStateEnum.PENDING,
      });
      campaignNode = await createCampaignNode();
      await createCampaignNodeState({
        runAt: new Date(),
        state: CampaignStateEnum.PENDING,
        attempts: 0,
      });
      const campaignNodeStates = await repository.getNextCampaignNodeStates();
      expect(campaignNodeStates.length).to.eq(0);
    });
    it("should return 0 campaign node states for campaign node states not in PENDING state", async () => {
      campaign = await createActiveCampaign();
      campaignNode = await createCampaignNode();
      await createCampaignNodeState({
        runAt: new Date(),
        state: CampaignStateEnum.RUNNING,
        attempts: 0,
      });
      const campaignNodeStates = await repository.getNextCampaignNodeStates();
      expect(campaignNodeStates.length).to.eq(0);
    });

    // Success case
    it("should return a campaign node state for nodes that not been run or timed out", async () => {
      campaign = await createActiveCampaign();
      campaignNode = await createCampaignNode();
      await createCampaignNodeState({
        runAt: new Date(),
        timeoutAt: moment().add(7, "days").toDate(),
        state: CampaignStateEnum.PENDING,
        attempts: 0,
      });
      const campaignNodeStates = await repository.getNextCampaignNodeStates();
      expect(campaignNodeStates.length).to.eq(1);
    });
  });
  describe("getNextTimedOutCampaignNodeStates", () => {
    it("should return 0 campaign node states for nodes that have been attempted but haven't timed out yet", async () => {
      campaign = await createActiveCampaign();
      campaignNode = await createCampaignNode();
      await createCampaignNodeState({
        runAt: new Date(),
        state: CampaignStateEnum.PENDING,
        timeoutAt: moment().add(30, "days").toDate(),
        attempts: 1,
      });
      const campaignNodeStates =
        await repository.getNextTimedOutCampaignNodeStates();
      expect(campaignNodeStates.length).to.eq(0);
    });
    it("should return a campaign node state for nodes that have timed out", async () => {
      campaign = await createActiveCampaign();
      campaignNode = await createCampaignNode();
      await createCampaignNodeState({
        runAt: moment().subtract(1, "days").toDate(),
        timeoutAt: new Date(),
        state: CampaignStateEnum.PENDING,
        attempts: 1,
      });
      const campaignNodeStates =
        await repository.getNextTimedOutCampaignNodeStates();
      expect(campaignNodeStates.length).to.eq(1);
    });
  });
  it("should return campaign node states for failed jobs");
});
