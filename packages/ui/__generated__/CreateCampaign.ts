/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: CreateCampaign
// ====================================================

export interface CreateCampaign_createCampaign_campaignNodes {
  __typename: "CampaignNode";
  id: string;
  kind: string | null;
  name: string | null;
  json: any | null;
  positionX: number | null;
  positionY: number | null;
}

export interface CreateCampaign_createCampaign_campaignNodeEdges {
  __typename: "CampaignNodeEdge";
  id: string;
  edgeKind: string | null;
  fromId: string | null;
  toId: string | null;
}

export interface CreateCampaign_createCampaign {
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
  campaignNodes: (CreateCampaign_createCampaign_campaignNodes | null)[] | null;
  campaignNodeEdges: (CreateCampaign_createCampaign_campaignNodeEdges | null)[] | null;
}

export interface CreateCampaign {
  createCampaign: CreateCampaign_createCampaign | null;
}
