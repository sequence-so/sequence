/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetAudienceById
// ====================================================

export interface GetAudienceById_audiences_nodes {
  __typename: "Audience";
  id: string;
  name: string | null;
  node: string | null;
  count: number | null;
  createdAt: any | null;
  updatedAt: any | null;
  executedAt: any | null;
}

export interface GetAudienceById_audiences {
  __typename: "PaginatedAudience";
  page: number | null;
  rows: number | null;
  nodes: (GetAudienceById_audiences_nodes | null)[] | null;
}

export interface GetAudienceById {
  audiences: GetAudienceById_audiences | null;
}

export interface GetAudienceByIdVariables {
  id?: string | null;
  localTo?: string | null;
}
