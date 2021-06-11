/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: UpdateCampaignNode
// ====================================================

export interface UpdateCampaignNode_updateCampaignNode {
  __typename: "CampaignNode";
  id: string;
  name: string | null;
  kind: string | null;
  json: any | null;
  positionX: number | null;
  positionY: number | null;
}

export interface UpdateCampaignNode {
  updateCampaignNode: UpdateCampaignNode_updateCampaignNode | null;
}

export interface UpdateCampaignNodeVariables {
  id: string;
  name?: string | null;
  json?: any | null;
  kind?: string | null;
  positionX?: number | null;
  positionY?: number | null;
}
