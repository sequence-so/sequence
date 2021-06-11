/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetAudienceWithProductUsers
// ====================================================

export interface GetAudienceWithProductUsers_audiences_nodes_productUsers {
  __typename: "ProductUser";
  id: string;
  firstName: string | null;
  lastName: string | null;
  email: string | null;
  externalId: string | null;
  createdAt: any | null;
  lastSeenAt: any | null;
}

export interface GetAudienceWithProductUsers_audiences_nodes {
  __typename: "Audience";
  id: string;
  name: string | null;
  node: string | null;
  productUsers: (GetAudienceWithProductUsers_audiences_nodes_productUsers | null)[] | null;
  createdAt: any | null;
  updatedAt: any | null;
  executedAt: any | null;
}

export interface GetAudienceWithProductUsers_audiences {
  __typename: "PaginatedAudience";
  page: number | null;
  rows: number | null;
  nodes: (GetAudienceWithProductUsers_audiences_nodes | null)[] | null;
}

export interface GetAudienceWithProductUsers {
  audiences: GetAudienceWithProductUsers_audiences | null;
}

export interface GetAudienceWithProductUsersVariables {
  id?: string | null;
}
