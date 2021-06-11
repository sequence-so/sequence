/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetCampaignNodeWithStates
// ====================================================

export interface GetCampaignNodeWithStates_campaignNodes_nodes_campaignNodeStates {
  __typename: "CampaignNodeState";
  id: string;
  state: string | null;
  didTimeout: boolean | null;
  attempts: number | null;
  userId: string | null;
  campaignId: string | null;
  productUserId: string | null;
  campaignNodeId: string | null;
  runAt: any | null;
  timeoutAt: any | null;
  completedAt: any | null;
  createdAt: any | null;
  updatedAt: any | null;
}

export interface GetCampaignNodeWithStates_campaignNodes_nodes {
  __typename: "CampaignNode";
  id: string;
  kind: string | null;
  name: string | null;
  json: any | null;
  positionX: number | null;
  positionY: number | null;
  campaignNodeStates: (GetCampaignNodeWithStates_campaignNodes_nodes_campaignNodeStates | null)[] | null;
  createdAt: any | null;
  updatedAt: any | null;
}

export interface GetCampaignNodeWithStates_campaignNodes {
  __typename: "PaginatedCampaignNodes";
  page: number | null;
  rows: number | null;
  nodes: (GetCampaignNodeWithStates_campaignNodes_nodes | null)[] | null;
}

export interface GetCampaignNodeWithStates {
  campaignNodes: GetCampaignNodeWithStates_campaignNodes | null;
}

export interface GetCampaignNodeWithStatesVariables {
  id: string;
  page?: number | null;
  limit?: number | null;
}
