import { expect } from "chai";
import { Condition, EventFilter } from "common/filters";
import {
  Campaign as CampaignNode,
  CampaignAudienceRules,
  CampaignEmailScheduling,
  CampaignNodeKind,
} from "common/campaign";

describe("Campaign Nodes", () => {
  it("should create an AudienceCampaignNode", () => {
    const emptyCondition = Condition.and();
    const node = CampaignNode.Audience.new()
      .setAudienceRules(CampaignAudienceRules.Existing)
      .setFilter(emptyCondition)
      .setId("123")
      .setAudienceId("my-audienceId")
      .setAudienceName("My Audience Name");

    expect(node.kind).to.eq(CampaignNodeKind.Audience);
    expect(node.getAudienceRules()).to.eq(CampaignAudienceRules.Existing);
    expect(node.getAudienceId()).to.eq("my-audienceId");
    expect(node.getAudienceName()).to.eq("My Audience Name");
    expect(node.getId()).to.eq("123");
    expect(node.getFilter()).to.deep.eq(emptyCondition);
  });

  it("should create an FilterCampaignNode", () => {
    const node = CampaignNode.Filter.new().setAudienceId("my-audienceId");
    expect(node.kind).to.eq(CampaignNodeKind.Filter);
  });

  it("should create an TriggerCampaignNode", () => {
    const node = CampaignNode.Trigger.new(
      Condition.and(EventFilter.new("Alert Fired").hasBeenPerformed())
    );
    node.setAudienceRules(CampaignAudienceRules.Both);
    expect(node.kind).to.eq(CampaignNodeKind.Trigger);
    expect(node.getAudienceRules()).to.eq(CampaignAudienceRules.Both);
  });

  it("should create a WaitCampaignNode", () => {
    const node = CampaignNode.Wait.new(5);
    expect(node.getDays()).to.eq(5);
  });

  it("should create a EmailCampaignNode", () => {
    const node = CampaignNode.Email.new("my-emailId")
      .setOriginalTemplateId("another-emailId")
      .setScheduling(CampaignEmailScheduling.Immediately)
      .setId("nodeId");
    expect(node.getEmailId()).to.eq("my-emailId");
    expect(node.getId()).to.eq("nodeId");
    expect(node.getScheduling()).to.eq(CampaignEmailScheduling.Immediately);
    expect(node.getOriginalTemplateId()).to.eq("another-emailId");
  });
});
