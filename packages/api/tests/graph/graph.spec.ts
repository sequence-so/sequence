import { expect } from "chai";
import { Condition } from "common/filters";
import {
  Campaign,
  CampaignAudienceRules,
  CampaignEmailScheduling,
  CampaignNodeKind,
  CampaignGraph,
} from "common/campaign";

describe("Campaign Graph", () => {
  it("should add nodes to a CampaignGraph", () => {
    let graph = new CampaignGraph();
    const trigger = Campaign.Trigger.new("a").setId("a");
    const wait = Campaign.Wait.new(3).setId("b");
    const email = Campaign.Email.new("c").setId("c");
    graph.addNodes(trigger, wait, email);
    expect(graph.getNodeById(trigger.id)).eq(trigger);
    expect(graph.getNodeById(wait.id)).eq(wait);
    expect(graph.getNodeById(email.id)).eq(email);
  });

  it("should add edges to a CampaignGraph", () => {
    let graph = new CampaignGraph();
    const trigger = Campaign.Trigger.new("a");
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
    let graph = new CampaignGraph();
    const trigger = Campaign.Trigger.new("a").setId("a");
    graph.addNodes(trigger);
    graph.removeNode(trigger);
    expect(graph.getNodeById(trigger.id)).to.be.undefined;
  });

  it("should remove edges", () => {
    let graph = new CampaignGraph();
    const trigger = Campaign.Trigger.new("a").setId("a");
    const wait = Campaign.Wait.new(3);
    graph.addNodes(trigger, wait);
    graph.addEdge(trigger, wait);
    expect(graph.removeEdge(trigger.id, wait.id)).to.be.true;
    expect(graph.removeEdge(trigger.id, wait.id)).to.be.false;
    expect(graph.getEdge(trigger, wait)).to.be.undefined;
  });
});
