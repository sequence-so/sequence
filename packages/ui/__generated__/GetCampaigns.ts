/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetCampaigns
// ====================================================

export interface GetCampaigns_campaigns_nodes {
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

export interface GetCampaigns_campaigns {
  __typename: "PaginatedCampaigns";
  page: number | null;
  rows: number | null;
  nodes: (GetCampaigns_campaigns_nodes | null)[] | null;
}

export interface GetCampaigns {
  campaigns: GetCampaigns_campaigns | null;
}

export interface GetCampaignsVariables {
  page?: number | null;
}
