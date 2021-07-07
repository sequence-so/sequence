import AbstractCampaignNode from "./nodes/abstractCampaignNode";
import AudienceCampaignNode from "./nodes/audienceCampaignNode";
import EmailCampaignNode from "./nodes/emailCampaignNode";
import FilterCampaignNode from "./nodes/filterCampaignNode";
import TriggerCampaignNode from "./nodes/triggerCampaignNode";
import WaitCampaignNode from "./nodes/waitCampaignNode";
import {
  CampaignAudienceRules,
  CampaignEmailScheduling,
  CampaignNodeKind,
} from "./types";

interface SerializedCampaignNode {
  id: string;
  json: any;
  kind: CampaignNodeKind;
  name: string;
  positionX: number;
  positionY: number;
}

export interface BaseAudienceCampaignNodeJson {
  audienceRules: CampaignAudienceRules;
  audienceId?: string;
  audienceName?: string;
}

export interface FilterCampaignNodeJson extends BaseAudienceCampaignNodeJson {
  waitValue: number;
}

export interface EmailCampaignNodeJson {
  emailId?: string;
  scheduling?: CampaignEmailScheduling;
  originalTemplateId?: string;
}

export interface WaitCampaignNodeJson {
  days: number;
}

export interface TriggerCampaignNodeJson extends BaseAudienceCampaignNodeJson {
  // filter?: Condition;
}

export interface AudienceNodeJson extends BaseAudienceCampaignNodeJson {
  // filter?: Condition;
}

export const deserialize = (node: SerializedCampaignNode) => {
  let deserializedNode: AbstractCampaignNode;
  switch (node.kind) {
    case CampaignNodeKind.Audience:
      let audienceJson = node.json as BaseAudienceCampaignNodeJson;
      deserializedNode = AudienceCampaignNode.new()
        .setAudienceId(audienceJson.audienceId)
        .setAudienceName(audienceJson.audienceName)
        .setAudienceRules(audienceJson.audienceRules);
      break;
    case CampaignNodeKind.Email:
      let emailJson = node.json as EmailCampaignNodeJson;
      deserializedNode = EmailCampaignNode.new()
        .setEmailId(emailJson.emailId)
        .setScheduling(emailJson.scheduling)
        .setOriginalTemplateId(emailJson.originalTemplateId);
      break;
    case CampaignNodeKind.Filter:
      let filterJson = node.json as FilterCampaignNodeJson;
      deserializedNode = FilterCampaignNode.new()
        .setAudienceId(filterJson.audienceId)
        .setAudienceName(filterJson.audienceName)
        .setAudienceRules(filterJson.audienceRules)
        .setWaitValue(filterJson.waitValue);
      break;
    case CampaignNodeKind.Trigger:
      let triggerJson = node.json as TriggerCampaignNodeJson;
      deserializedNode = TriggerCampaignNode.new()
        .setAudienceId(triggerJson.audienceId)
        .setAudienceName(triggerJson.audienceName)
        .setAudienceRules(triggerJson.audienceRules);
      break;
    case CampaignNodeKind.Wait:
      let waitJson = node.json as WaitCampaignNodeJson;
      deserializedNode = WaitCampaignNode.new().setDays(waitJson.days);
      break;
  }
  return deserializedNode
    .setId(node.id)
    .setName(node.name)
    .setPositionX(node.positionX)
    .setPositionY(node.positionY);
};

export const serialize = (node: AbstractCampaignNode) => {
  switch (node.kind) {
    case CampaignNodeKind.Audience:
      const audienceNode = node as AudienceCampaignNode;
      audienceNode.json = {
        audienceRules: audienceNode.getAudienceRules()!,
        audienceId: audienceNode.getAudienceId(),
        audienceName: audienceNode.getAudienceName(),
      };
      return audienceNode;
    case CampaignNodeKind.Email:
      const emailNode = node as EmailCampaignNode;
      emailNode.json = {
        emailId: emailNode.getEmailId(),
        scheduling: emailNode.getScheduling(),
        originalTemplateId: emailNode.getOriginalTemplateId(),
      };
      return emailNode;
    case CampaignNodeKind.Filter:
      const filterNode = node as FilterCampaignNode;
      filterNode.json = {
        audienceRules: filterNode.getAudienceRules()!,
        audienceId: filterNode.getAudienceId(),
        audienceName: filterNode.getAudienceName(),
        waitValue: filterNode.getWaitValue()!,
      };
      return filterNode;
    case CampaignNodeKind.Trigger:
      const triggerNode = node as TriggerCampaignNode;
      triggerNode.json = {
        audienceRules: triggerNode.getAudienceRules()!,
        audienceId: triggerNode.getAudienceId(),
        audienceName: triggerNode.getAudienceName(),
      };
      return triggerNode;
    case CampaignNodeKind.Wait:
      const waitNode = node as WaitCampaignNode;
      waitNode.json = {
        days: waitNode.getDays()!,
      };
      return waitNode;
  }
};
