import { Edge } from "./nodes";
import AbstractCampaignNode from "./nodes/abstractCampaignNode";
import AudienceCampaignNode from "./nodes/audienceCampaignNode";
import TriggerCampaignNode from "./nodes/triggerCampaignNode";

type CampaignNodeID = string;
type CampaignNodeEdgeId = string;

export enum CampaignNodeKind {
  Trigger = "Trigger",
  Audience = "Audience",
  Filter = "Filter",
  Wait = "Wait",
  Email = "Email",
}

export type EntryNodeKinds = TriggerCampaignNode | AudienceCampaignNode;

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

export enum EdgeKind {
  Default = "Default",
  Timeout = "Timeout",
}

export enum WaitType {
  Relative = "Relative",
  Specific = "Specific",
}

export type WaitValueType = WaitValueRelativeDuration | WaitValueSpecificTime;

export interface WaitValueRelativeDuration {
  kind: WaitType.Relative;
  days?: number;
  hours?: number;
  minutes?: number;
}

export interface WaitValueSpecificTime {
  kind: WaitType.Specific;
  hour: number;
  minute: number;
}

export type CustomEdge = {
  edgeKind: EdgeKind;
  node: AbstractCampaignNode;
};

export type CampaignGraphEdges = Record<CampaignNodeEdgeId, Edge>;
