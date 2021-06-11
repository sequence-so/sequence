/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: CreateCampaignNode
// ====================================================

export interface CreateCampaignNode_createCampaignNode_campaign {
  __typename: "Campaign";
  id: string;
  name: string | null;
}

export interface CreateCampaignNode_createCampaignNode {
  __typename: "CampaignNode";
  id: string;
  name: string | null;
  kind: string | null;
  json: any | null;
  positionX: number | null;
  positionY: number | null;
  campaign: CreateCampaignNode_createCampaignNode_campaign | null;
}

export interface CreateCampaignNode {
  createCampaignNode: CreateCampaignNode_createCampaignNode | null;
}

export interface CreateCampaignNodeVariables {
  id?: string | null;
  name?: string | null;
  campaignId: string;
  kind: string;
  positionX?: number | null;
  positionY?: number | null;
}
