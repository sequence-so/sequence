import { expect } from "chai";
import {
  CampaignAudienceRules,
  Edge,
  EdgeKind,
  serialize,
} from "common/campaign";
import AudienceCampaignNode from "common/campaign/nodes/audienceCampaignNode";
import EmailCampaignNode from "common/campaign/nodes/emailCampaignNode";
import {
  AttributeFilter,
  Condition,
  serialize as serializeFilter,
} from "common/filters";
import Campaign, { CampaignStateEnum } from "src/models/campaign.model";
import productUserSeed from "tests/seeds/productUser.seed";
import Audience from "src/models/audience.model";
import User from "src/models/user.model";
import userSeed from "tests/seeds/user.seed";
import CampaignNode from "src/models/campaignNode.model";
import AbstractCampaignNode from "campaign/nodes/abstractCampaignNode";
import CampaignNodeEdge from "campaign/nodes/campaignNodeEdge";
import CampaignNodeEdgeModel from "src/models/campaignNodeEdge.model";
import CampaignNodeState from "src/models/campaignNodeState.model";

let user: User;
let campaign: Campaign;
let edges: CampaignNodeEdgeModel[];
let campaignNodes: CampaignNode[];

const saveCampaignNode = async (node: AbstractCampaignNode) => {
  const serialized = serialize(node);
  return CampaignNode.create({
    id: node.getId(),
    name: node.getName(),
    positionX: node.positionX || 0,
    positionY: node.positionY || 0,
    json: serialized.json,
    kind: node.kind,
    timeoutAfter: node.timeoutAfter || null,
    userId: user.id,
    campaignId: campaign.id,
  });
};

const saveEdge = async (edge: CampaignNodeEdge) =>
  CampaignNodeEdgeModel.create({
    id: edge.getId(),
    fromId: edge.getFromId(),
    toId: edge.getToId(),
    edgeKind: edge.getEdgeKind(),
  });

const saveCampaignNodes = async (...nodes: AbstractCampaignNode[]) =>
  Promise.all(nodes.map(saveCampaignNode));

const saveEdges = async (...edges: CampaignNodeEdge[]) =>
  Promise.all(edges.map(saveEdge));

const deleteEdges = async () => Promise.all(edges.map((e) => e.destroy()));
const deleteNodes = async () =>
  Promise.all(campaignNodes.map((e) => e.destroy()));

const createSimpleCampaign = async (
  audienceRule: CampaignAudienceRules = CampaignAudienceRules.Both
) => {
  campaign = await Campaign.create({
    state: CampaignStateEnum.RUNNING,
    userId: user.id,
    launchedAt: new Date(),
    isDraft: false,
  });
  const audience = await Audience.create({
    name: "FirstName Is Tom",
    userId: user.id,
    node: JSON.stringify(
      serializeFilter(Condition.and(AttributeFilter.new("firstName", "Tom")))
    ),
  });
  const audienceCampaignode = AudienceCampaignNode.new();
  audienceCampaignode.setAudienceId(audience.id);
  audienceCampaignode.setAudienceName(audience.name);
  audienceCampaignode.setAudienceRules(audienceRule);
  const email = EmailCampaignNode.new();

  campaignNodes = await saveCampaignNodes(audienceCampaignode, email);
  edges = await saveEdges(
    Edge.new(audienceCampaignode.id, email.id, EdgeKind.Default)
  );
  return {
    audienceCampaignode,
    email,
    campaign,
  };
};

describe("productUserSaved", () => {
  before(async () => {
    user = await userSeed();
  });
  afterEach(async () => {
    await campaign.destroy();
    await deleteEdges();
    await deleteNodes();
  });
  it("should not add product users to campaigns they don't match", async () => {
    const simpleCampaign = await createSimpleCampaign();
    // const evaluator = new CampaignNodeEvaluator(app, user.id, campaign.id);
    // await evaluator.build();
    // const campaignNode = defaultCampaign.audienceCampaignode;
    const productUser = await productUserSeed({
      email: "test@email.com",
      // this name doesn't match our trigger
      firstName: "Jake",
      userId: user.id,
    });

    const nodeState = await CampaignNodeState.findOne({
      where: {
        productUserId: productUser.id,
        campaignId: simpleCampaign.campaign.id,
      },
    });
    expect(nodeState).to.equal(null);
  });

  it("should add product users to campaigns they match", async () => {
    const simpleCampaign = await createSimpleCampaign();
    const productUser = await productUserSeed({
      email: "test@email.com",
      // this name matches our trigger
      firstName: "Tom",
      userId: user.id,
    });

    const nodeState = await CampaignNodeState.findOne({
      where: {
        productUserId: productUser.id,
        campaignId: simpleCampaign.campaign.id,
      },
    });
    expect(nodeState.id).to.not.be.undefined;
  });

  it("should not add product users to campaigns they're already in", async () => {
    const simpleCampaign = await createSimpleCampaign();
    const productUser = await productUserSeed({
      email: "test@email.com",
      // this name matches our trigger
      firstName: "Tom",
      userId: user.id,
    });
    let nodeStates = await CampaignNodeState.findAll({
      where: {
        productUserId: productUser.id,
        campaignId: simpleCampaign.campaign.id,
      },
      order: [["createdAt", "ASC"]],
    });
    expect(nodeStates.length).to.eq(2);
    expect(nodeStates[0].state).to.eq(CampaignStateEnum.COMPLETED);
    expect(nodeStates[1].state).to.eq(CampaignStateEnum.PENDING);
    // not matching ( we won't remove from the campaign since it's already passed that step)
    productUser.firstName = "Joe";
    await productUser.save();
    // matching again, but we shouldn't add them to the campaign twice
    productUser.firstName = "Tom";
    await productUser.save();

    nodeStates = await CampaignNodeState.findAll({
      where: {
        productUserId: productUser.id,
        campaignId: simpleCampaign.campaign.id,
      },
      order: [["createdAt", "ASC"]],
    });
    expect(nodeStates.length).to.eq(2);
    expect(nodeStates[0].state).to.eq(CampaignStateEnum.COMPLETED);
    expect(nodeStates[1].state).to.eq(CampaignStateEnum.PENDING);
  });

  it("should not add product users to campaigns when the CampaignAudienceRule only permits existing users", async () => {
    const simpleCampaign = await createSimpleCampaign(
      CampaignAudienceRules.Existing
    );
    const productUser = await productUserSeed({
      email: "test@email.com",
      // this name matches our trigger
      firstName: "Tom",
      userId: user.id,
    });
    const nodeState = await CampaignNodeState.findOne({
      where: {
        productUserId: productUser.id,
        campaignId: simpleCampaign.campaign.id,
      },
    });
    expect(nodeState).to.eq(null);
  });
  // TODO: See Event.afterSave hook.
  it("should work for event based campaign triggers");
});
