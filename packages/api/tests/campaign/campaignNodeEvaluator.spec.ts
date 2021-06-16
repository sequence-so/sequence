import { expect } from "chai";
import sinon from "sinon";
import moment from "moment";
import { CampaignNodeKind, Edge, EdgeKind, serialize } from "common/campaign";
import AbstractCampaignNode from "common/campaign/nodes/abstractCampaignNode";
import AudienceCampaignNode from "common/campaign/nodes/audienceCampaignNode";
import CampaignNodeEdge from "common/campaign/nodes/campaignNodeEdge";
import EmailCampaignNode from "common/campaign/nodes/emailCampaignNode";
import FilterCampaignNode from "common/campaign/nodes/filterCampaignNode";
import TriggerCampaignNode from "common/campaign/nodes/triggerCampaignNode";
import WaitCampaignNode from "common/campaign/nodes/waitCampaignNode";
import { Condition } from "common/filters";
import App from "src/app";
import Campaign, { CampaignStateEnum } from "src/models/campaign.model";
import CampaignNodeEdgeModel from "src/models/campaignNodeEdge.model";
import User from "src/models/user.model";
import CampaignNodeEvaluator from "src/services/campaigns/campaignNodeEvaluator";
import campaignSeed from "tests/seeds/campaign.seed";
import productUserSeed from "tests/seeds/productUser.seed";
import userSeed from "tests/seeds/user.seed";
import ProductUser from "src/models/productUser.model";
import CampaignNodeState from "src/models/campaignNodeState.model";
import AbstractNodeExecutor from "src/services/campaigns/nodes/abstractNodeExecutor";
import ExecutionResult, {
  ExecutionResultEnum,
} from "src/services/campaigns/executionResult";

const app: App = new App();
let user: User;
let campaign: Campaign;

const saveCampaignNode = async (node: AbstractCampaignNode) => {
  const serialized = serialize(node);
  return app.models.CampaignNode.create({
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

/**
 * Trigger -> Wait(1) -> Filter(1) -> Email(1) -> Wait(2) -> Email(3)
 *                             |
 *                             +----> Email(2)
 * Audience -> Email(4)
 */
const createCampaign = async () => {
  const trigger = TriggerCampaignNode.new(Condition.and());
  const wait1 = WaitCampaignNode.new(7);
  const filter1 = FilterCampaignNode.new(Condition.and());
  const email1 = EmailCampaignNode.new();
  const wait2 = WaitCampaignNode.new(7);
  const email3 = EmailCampaignNode.new();
  const email2 = EmailCampaignNode.new();
  const audience = AudienceCampaignNode.new(Condition.or());
  const email4 = EmailCampaignNode.new();

  await saveCampaignNodes(
    trigger,
    wait1,
    filter1,
    email1,
    wait2,
    email3,
    email2,
    audience,
    email4
  );
  await saveEdges(
    Edge.new(trigger.id, wait1.id, EdgeKind.Default),
    Edge.new(wait1.id, filter1.id, EdgeKind.Default),
    Edge.new(filter1.id, email1.id, EdgeKind.Default),
    Edge.new(email1.id, wait2.id, EdgeKind.Default),
    Edge.new(wait2.id, email3.id, EdgeKind.Default),
    Edge.new(filter1.id, email2.id, EdgeKind.Timeout),
    Edge.new(audience.id, email4.id, EdgeKind.Default)
  );
  return {
    trigger,
    wait1,
    filter1,
    email1,
    wait2,
    email3,
    email2,
    audience,
    email4,
  };
};

describe("campaign node evaluator", function () {
  beforeEach(async () => {
    user = await userSeed();
    campaign = await campaignSeed({
      userId: user.id,
      name: "default",
      state: CampaignStateEnum.PENDING,
    });
  });
  afterEach(async () => {
    campaign.destroy();
    user.destroy();
    app.models.CampaignNode.destroy();
    app.models.CampaignNodeEdge.destroy();
    app.models.CampaignNodeState.destroy();
  });

  it("should get no entry nodes", async () => {
    const evaluator = new CampaignNodeEvaluator(app, user.id, campaign.id);
    await evaluator.build();
    const nodes = await evaluator.getEntryNodes();
    expect(nodes.length).to.eq(0);
  });
  it("should get entry nodes", async () => {
    const evaluator = new CampaignNodeEvaluator(app, user.id, campaign.id);
    const trigger = TriggerCampaignNode.new(Condition.and());
    const audience = AudienceCampaignNode.new(Condition.or());
    const trigger2 = TriggerCampaignNode.new(Condition.and());
    const filter = FilterCampaignNode.new(Condition.and());
    await saveCampaignNodes(trigger, audience, trigger2, filter);
    await evaluator.build();
    const entryNodes = await evaluator.getEntryNodes();
    expect(entryNodes.length).to.eq(3);
  });
  it("should get next node for a campaign node", async () => {
    const evaluator = new CampaignNodeEvaluator(app, user.id, campaign.id);
    const trigger = TriggerCampaignNode.new(Condition.and());
    const filter = FilterCampaignNode.new(Condition.and());
    await saveCampaignNodes(trigger, filter);
    await saveEdges(Edge.new(trigger.getId(), filter.getId()));
    await evaluator.build();
    const nextDefaultNode = evaluator.getAssociatedDefaultNodes(trigger)[0];
    expect(nextDefaultNode.kind).to.eq(CampaignNodeKind.Filter);
    expect(nextDefaultNode.getId()).to.eq(filter.getId());
  });
  it("should get timeout node for a campaign node", async () => {
    const evaluator = new CampaignNodeEvaluator(app, user.id, campaign.id);
    const trigger = TriggerCampaignNode.new(Condition.and());
    const filter = FilterCampaignNode.new(Condition.and());
    await saveCampaignNodes(trigger, filter);
    await saveEdges(
      Edge.new(trigger.getId(), filter.getId(), EdgeKind.Timeout)
    );
    await evaluator.build();
    const nextDefaultNode = evaluator.getAssociatedDefaultNodes(trigger);
    expect(nextDefaultNode).to.deep.eq([]);
    const nextTimeoutNode = evaluator.getAssociatedTimeoutNodes(trigger)[0];
    expect(nextTimeoutNode.getId()).to.eq(filter.getId());
  });
  it("should get next nodes for a campaign", async () => {
    const TRIGGER_NODE_STATES = 20;
    const AUDIENCE_NODE_STATES = 10;
    const executeAudienceBuilderQuery = async (
      node: TriggerCampaignNode | AudienceCampaignNode
    ) => {
      let promises: Promise<ProductUser>[];
      if (node.kind === CampaignNodeKind.Trigger) {
        promises = Array.from({ length: TRIGGER_NODE_STATES }).map(() =>
          productUserSeed({ userId: user.id })
        );
      } else {
        promises = Array.from({ length: AUDIENCE_NODE_STATES }).map(() =>
          productUserSeed({ userId: user.id })
        );
      }
      return Promise.all(promises);
    };
    const defaultCampaign = await createCampaign();
    const evaluator = new CampaignNodeEvaluator(app, user.id, campaign.id);
    await evaluator.build();
    const entryNodes = evaluator.getEntryNodes();
    expect(entryNodes.length).to.eq(2);
    const dateNow = moment("2021-06-21 00:00:00");
    sinon
      .stub(evaluator, "executeAudience")
      .callsFake(executeAudienceBuilderQuery);
    sinon.stub(evaluator, "getNow").callsFake(() => dateNow.toDate());
    await evaluator.evaluateCampaignEntryNodes();
    const audienceNodeStates = await CampaignNodeState.findAll({
      where: {
        campaignNodeId: defaultCampaign.audience.getId(),
      },
    });
    const triggerNodeStates = await CampaignNodeState.findAll({
      where: {
        campaignNodeId: defaultCampaign.trigger.getId(),
      },
    });
    // ensure that we've marked the correct nodes as completed
    expect(audienceNodeStates.length).to.eq(AUDIENCE_NODE_STATES);
    expect(triggerNodeStates.length).to.eq(TRIGGER_NODE_STATES);

    // ensure that we've queued up the next nodes
    const wait1CampaignNodeStates = await CampaignNodeState.findAll({
      where: {
        campaignNodeId: defaultCampaign.wait1.id,
        runAt: moment(dateNow)
          .add(defaultCampaign.wait1.getDays(), "days")
          .toDate(),
        state: CampaignStateEnum.PENDING,
        campaignId: campaign.id,
      },
    });
    expect(wait1CampaignNodeStates.length).to.eq(TRIGGER_NODE_STATES);

    const email4CampaignNodeStates = await CampaignNodeState.findAll({
      where: {
        campaignNodeId: defaultCampaign.email4.id,
        runAt: dateNow.toDate(),
        state: CampaignStateEnum.PENDING,
        campaignId: campaign.id,
      },
    });
    expect(email4CampaignNodeStates.length).to.eq(AUDIENCE_NODE_STATES);
  });
});

class EmptyExecutor extends AbstractNodeExecutor {
  async execute(state: CampaignNodeState) {
    return new ExecutionResult(ExecutionResultEnum.Continue);
  }
}

class ErrorExecutor extends AbstractNodeExecutor {
  execute(state: CampaignNodeState) {
    return Promise.reject();
  }
}

describe("campaign node evaluator - next node", () => {
  beforeEach(async () => {
    user = await userSeed();
    campaign = await campaignSeed({
      userId: user.id,
      name: "default",
      state: CampaignStateEnum.PENDING,
    });
  });
  afterEach(async () => {
    campaign.destroy();
    user.destroy();
    app.models.CampaignNode.destroy();
    app.models.CampaignNodeEdge.destroy();
    app.models.CampaignNodeState.destroy();
  });
  it("should evaluate the next node", async () => {
    const defaultCampaign = await createCampaign();
    const evaluator = new CampaignNodeEvaluator(app, user.id, campaign.id);
    await evaluator.build();
    const campaignNode = defaultCampaign.filter1;
    const filterId = campaignNode.getId();
    const productUser = await productUserSeed({
      email: "test@email.com",
      userId: user.id,
    });
    const campaignNodeState = await CampaignNodeState.create({
      campaignId: campaign.id,
      campaignNodeId: filterId,
      productUserId: productUser.id,
      state: CampaignStateEnum.PENDING,
      runAt: new Date(),
      userId: user.id,
      attempts: 0,
    });
    sinon
      .stub(evaluator, "getExecutor")
      .callsFake((node) => new EmptyExecutor(app, node));
    await evaluator.evaluateCampaignNode(campaignNode, campaignNodeState);
    await campaignNodeState.reload();
    expect(campaignNodeState.state).to.eq(CampaignStateEnum.COMPLETED);
    expect(campaignNodeState.completedAt).to.not.null;
    expect(campaignNodeState.attempts).to.eq(1);
  });
  it("should queue up the next CampaignNodeState", async () => {
    const defaultCampaign = await createCampaign();
    const evaluator = new CampaignNodeEvaluator(app, user.id, campaign.id);
    await evaluator.build();
    const campaignNode = defaultCampaign.filter1;
    const filterId = campaignNode.getId();
    const productUser = await productUserSeed({
      email: "test@email.com",
      userId: user.id,
    });
    const campaignNodeState = await CampaignNodeState.create({
      campaignId: campaign.id,
      campaignNodeId: filterId,
      productUserId: productUser.id,
      state: CampaignStateEnum.PENDING,
      runAt: new Date(),
      userId: user.id,
      attempts: 0,
    });
    sinon
      .stub(evaluator, "getExecutor")
      .callsFake((node) => new EmptyExecutor(app, node));

    await evaluator.createNextNodeState(campaignNode, campaignNodeState);

    const nextNodeState = await CampaignNodeState.findOne({
      where: {
        campaignId: campaign.id,
        campaignNodeId: defaultCampaign.email1.getId(),
        productUserId: productUser.id,
      },
    });
    expect(nextNodeState.state).to.eq(CampaignStateEnum.PENDING);
    expect(nextNodeState.runAt).to.not.null;
    expect(nextNodeState.attempts).to.eq(0);
  });
  it("should end the campaign when an error occurs", async () => {
    const defaultCampaign = await createCampaign();
    const evaluator = new CampaignNodeEvaluator(app, user.id, campaign.id);
    await evaluator.build();
    const campaignNode = defaultCampaign.filter1;
    const filterId = campaignNode.getId();
    const productUser = await productUserSeed({
      email: "test@email.com",
      userId: user.id,
    });
    const campaignNodeState = await CampaignNodeState.create({
      campaignId: campaign.id,
      campaignNodeId: filterId,
      productUserId: productUser.id,
      state: CampaignStateEnum.PENDING,
      runAt: new Date(),
      userId: user.id,
      attempts: 0,
    });
    sinon
      .stub(evaluator, "getExecutor")
      .callsFake((node) => new ErrorExecutor(app, node));

    await evaluator.evaluateCampaignNode(campaignNode, campaignNodeState);
    await campaignNodeState.reload();
    expect(campaignNodeState.state).to.eq(CampaignStateEnum.ERROR);
    expect(campaignNodeState.attempts).to.eq(1);
    expect(campaignNodeState.completedAt).to.not.null;
  });
});
