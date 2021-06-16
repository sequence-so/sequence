/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetCampaignsWithNodes
// ====================================================

export interface GetCampaignsWithNodes_campaigns_nodes_campaignNodes {
  __typename: "CampaignNode";
  id: string;
  kind: string | null;
  name: string | null;
  json: any | null;
  positionX: number | null;
  positionY: number | null;
}

export interface GetCampaignsWithNodes_campaigns_nodes_campaignNodeEdges {
  __typename: "CampaignNodeEdge";
  id: string;
  edgeKind: string | null;
  fromId: string | null;
  toId: string | null;
}

export interface GetCampaignsWithNodes_campaigns_nodes {
  __typename: "Campaign";
  id: string;
  name: string | null;
  state: string | null;
  isDraft: boolean | null;
  userId: string | null;
  launchedAt: any | null;
  stoppedAt: any | null;
  createdAt: any | null;
  updatedAt: any | null;
  campaignNodes: (GetCampaignsWithNodes_campaigns_nodes_campaignNodes | null)[] | null;
  campaignNodeEdges: (GetCampaignsWithNodes_campaigns_nodes_campaignNodeEdges | null)[] | null;
}

export interface GetCampaignsWithNodes_campaigns {
  __typename: "PaginatedCampaigns";
  page: number | null;
  rows: number | null;
  nodes: (GetCampaignsWithNodes_campaigns_nodes | null)[] | null;
}

export interface GetCampaignsWithNodes {
  campaigns: GetCampaignsWithNodes_campaigns | null;
}
