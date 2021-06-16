/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: UpdateCampaign
// ====================================================

export interface UpdateCampaign_updateCampaign {
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
}

export interface UpdateCampaign {
  updateCampaign: UpdateCampaign_updateCampaign | null;
}

export interface UpdateCampaignVariables {
  id: string;
  name?: string | null;
}
