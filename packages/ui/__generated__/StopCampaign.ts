/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: StopCampaign
// ====================================================

export interface StopCampaign_stopCampaign {
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

export interface StopCampaign {
  stopCampaign: StopCampaign_stopCampaign | null;
}

export interface StopCampaignVariables {
  id: string;
}
