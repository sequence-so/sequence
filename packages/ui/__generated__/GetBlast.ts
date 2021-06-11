/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetBlast
// ====================================================

export interface GetBlast_blasts_nodes_audience_productUsers {
  __typename: "ProductUser";
  id: string;
  firstName: string | null;
  lastName: string | null;
  email: string | null;
  createdAt: any | null;
  lastSeenAt: any | null;
}

export interface GetBlast_blasts_nodes_audience {
  __typename: "Audience";
  productUsers: (GetBlast_blasts_nodes_audience_productUsers | null)[] | null;
}

export interface GetBlast_blasts_nodes {
  __typename: "Blast";
  id: string;
  name: string | null;
  sentAt: any | null;
  userId: string;
  emailId: string | null;
  audience: GetBlast_blasts_nodes_audience | null;
  audienceId: string | null;
  createdAt: any | null;
  updatedAt: any | null;
}

export interface GetBlast_blasts {
  __typename: "PaginatedBlast";
  page: number | null;
  rows: number | null;
  nodes: (GetBlast_blasts_nodes | null)[] | null;
}

export interface GetBlast {
  blasts: GetBlast_blasts | null;
}

export interface GetBlastVariables {
  id?: string | null;
}
