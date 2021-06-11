/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: LaunchCampaign
// ====================================================

export interface LaunchCampaign_launchCampaign {
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

export interface LaunchCampaign {
  launchCampaign: LaunchCampaign_launchCampaign | null;
}

export interface LaunchCampaignVariables {
  id: string;
}
