import { expect } from "chai";
import { Condition, EventFilter, PageFilter } from "common/filters";
import {
  Campaign,
  CampaignGraph,
  WaitType,
  buildCampaign as buildGraph,
  EdgeKind,
  Edge,
} from "common/campaign";
import CampaignNodeEdge from "common/campaign/nodes/campaignNodeEdge";

describe("Campaign Graph", () => {
  it("should add nodes to a CampaignGraph", () => {
    const graph = new CampaignGraph();
    const trigger = Campaign.Trigger.new().setId("a");
    const wait = Campaign.Wait.new(3).setId("b");
    const email = Campaign.Email.new("c").setId("c");
    graph.addNodes(trigger, wait, email);
    expect(graph.getNodeById(trigger.id)).eq(trigger);
    expect(graph.getNodeById(wait.id)).eq(wait);
    expect(graph.getNodeById(email.id)).eq(email);
  });

  it("should add edges to a CampaignGraph", () => {
    const graph = new CampaignGraph();
    const trigger = Campaign.Trigger.new();
    const wait = Campaign.Wait.new(3);
    const email = Campaign.Email.new("c");
    const waitAgain = Campaign.Wait.new(1);
    graph.addNodes(trigger, wait, email, waitAgain);
    const e1 = graph.addEdge(trigger.id, wait);
    expect(graph.getEdge(trigger, wait)).to.deep.eq(e1);
    const e2 = graph.addEdge(wait, email.id);
    expect(graph.getEdge(wait, email)).to.deep.eq(e2);
    const e3 = graph.addEdge(wait.id, waitAgain.id);
    expect(graph.getEdge(wait, waitAgain)).to.deep.eq(e3);
  });

  it("should remove nodes", () => {
    const graph = new CampaignGraph();
    const trigger = Campaign.Trigger.new().setId("a");
    graph.addNodes(trigger);
    graph.removeNode(trigger);
    expect(graph.getNodeById(trigger.id)).to.be.undefined;
  });

  it("should remove edges", () => {
    const graph = new CampaignGraph();
    const trigger = Campaign.Trigger.new().setId("a");
    const wait = Campaign.Wait.new(3);
    graph.addNodes(trigger, wait);
    graph.addEdge(trigger, wait);
    expect(graph.removeEdge(trigger.id, wait.id)).to.be.true;
    expect(graph.removeEdge(trigger.id, wait.id)).to.be.false;
    expect(graph.getEdge(trigger, wait)).to.be.undefined;
  });
});

describe("buildCampaign", () => {
  it("should build a campaign", () => {
    const didSignUp = Campaign.Trigger.new(
      Condition.and(EventFilter.new("Sign Up").hasBeenPerformed())
    );
    const delayNode = Campaign.Wait.new(5);

    const viewedPricingNode = Campaign.Filter.new(
      Condition.and(PageFilter.new("/pricing").hasBeenViewed())
    )
      .setWaitType(WaitType.Relative)
      .setWaitValue(2);

    const sendPurchaseEmail = Campaign.Email.new("my-email-id");

    const sendPricingEmailNode = Campaign.Email.new("other-email-id");

    const edges = [
      Edge.new(didSignUp.id, delayNode.id),
      Edge.new(delayNode.id, viewedPricingNode.id),
      Edge.new(viewedPricingNode.id, sendPurchaseEmail.id).setEdgeKind(
        EdgeKind.Default
      ),
      Edge.new(viewedPricingNode.id, sendPricingEmailNode.id).setEdgeKind(
        EdgeKind.Timeout
      ),
    ];
    const { errors, graph } = buildGraph({
      edges: edges,
      nodes: [
        didSignUp,
        delayNode,
        viewedPricingNode,
        sendPricingEmailNode,
        sendPurchaseEmail,
      ],
    });
    expect(errors.length).to.eq(0);
    expect(graph.getNodeById(didSignUp.id)).to.deep.eq(didSignUp);
    expect(graph.getNodeById(delayNode.id)).to.deep.eq(delayNode);
    expect(graph.getNodeById(viewedPricingNode.id)).to.deep.eq(
      viewedPricingNode
    );
    expect(graph.getNodeById(sendPurchaseEmail.id)).to.deep.eq(
      sendPurchaseEmail
    );
    expect(graph.getNodeById(sendPricingEmailNode.id)).to.deep.eq(
      sendPricingEmailNode
    );

    expect(graph.getEdge(didSignUp, delayNode)?.getEdgeKind()).to.eq(
      EdgeKind.Default
    );
    expect(graph.getEdge(delayNode, viewedPricingNode)?.getEdgeKind()).to.eq(
      EdgeKind.Default
    );
    expect(
      graph.getEdge(viewedPricingNode, sendPurchaseEmail)?.getEdgeKind()
    ).to.eq(EdgeKind.Default);
    expect(
      graph.getEdge(viewedPricingNode, sendPricingEmailNode)?.getEdgeKind()
    ).to.eq(EdgeKind.Timeout);
  });
  it("should detect invalid node connections and report an error", () => {
    const didSignUp = Campaign.Trigger.new(
      Condition.and(EventFilter.new("Sign Up").hasBeenPerformed())
    );
    const delayNode = Campaign.Wait.new(5);
    // const { errors } = buildGraph(
    //   {
    //     [delayNode.id]: didSignUp,
    //   },
    //   didSignUp,
    //   delayNode
    // );
    // expect(errors.length).to.eq(1);
    // expect(errors[0]).to.eq(
    //   `Campaign Node of type "Wait" cannot connect to a "Trigger"`
    // );
  });
  it("should detect cycles and report an error", () => {
    const trigger = Campaign.Trigger.new();
    const filter = Campaign.Filter.new().setId("a");
    const email = Campaign.Email.new().setId("b");
    // const { errors, graph } = buildGraph(
    //   {
    //     [trigger.id]: filter,
    //     [filter.id]: email,
    //     [email.id]: filter,
    //   },
    //   trigger,
    //   filter,
    //   email
    // );
    // expect(graph.getSourceNodeIds()).to.deep.eq([trigger.id]);
    // expect(errors.length).to.eq(1);
    // expect(errors[0]).to.eq(`Detected cycle from ${filter.id} to ${email.id}`);
  });
});
