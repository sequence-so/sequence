/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: ConnectCampaignNodes
// ====================================================

export interface ConnectCampaignNodes_connectCampaignNodes {
  __typename: "CampaignNodeEdge";
  fromId: string | null;
  toId: string | null;
  edgeKind: string | null;
  createdAt: any | null;
  updatedAt: any | null;
}

export interface ConnectCampaignNodes {
  connectCampaignNodes: ConnectCampaignNodes_connectCampaignNodes | null;
}

export interface ConnectCampaignNodesVariables {
  id?: string | null;
  fromId: string;
  toId: string;
  edgeKind: string;
}
