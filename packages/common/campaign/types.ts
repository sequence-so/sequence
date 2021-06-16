import AbstractCampaignNode from "./nodes/abstractCampaignNode";

type CampaignNodeID = string;

export enum CampaignNodeKind {
  Trigger = "Trigger",
  Audience = "Audience",
  Filter = "Filter",
  Wait = "Wait",
  Email = "Email",
}

export enum CampaignAudienceRules {
  Existing = "Existing",
  New = "New",
  Both = "Both",
}

export enum CampaignEmailScheduling {
  Immediately = "Immediately",
  BusinessHours = "BusinessHours",
  SpecificTime = "SpecificTime",
}

export enum EdgeType {
  DEFAULT = 0,
  TIMEOUT = 1,
}

export type CampaignGraphEdges = Record<CampaignNodeID, AbstractCampaignNode>;
