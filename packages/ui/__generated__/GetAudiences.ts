/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetAudiences
// ====================================================

export interface GetAudiences_audiences_nodes {
  __typename: "Audience";
  id: string;
  name: string | null;
  node: string | null;
  count: number | null;
  executedAt: any | null;
  createdAt: any | null;
  updatedAt: any | null;
}

export interface GetAudiences_audiences {
  __typename: "PaginatedAudience";
  page: number | null;
  rows: number | null;
  nodes: (GetAudiences_audiences_nodes | null)[] | null;
}

export interface GetAudiences {
  audiences: GetAudiences_audiences | null;
}
