/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetBlasts
// ====================================================

export interface GetBlasts_blasts_nodes_audience {
  __typename: "Audience";
  count: number | null;
}

export interface GetBlasts_blasts_nodes {
  __typename: "Blast";
  id: string;
  name: string | null;
  audience: GetBlasts_blasts_nodes_audience | null;
  sentAt: any | null;
  userId: string;
  emailId: string | null;
  audienceId: string | null;
  createdAt: any | null;
  updatedAt: any | null;
}

export interface GetBlasts_blasts {
  __typename: "PaginatedBlast";
  page: number | null;
  rows: number | null;
  nodes: (GetBlasts_blasts_nodes | null)[] | null;
}

export interface GetBlasts {
  blasts: GetBlasts_blasts | null;
}
