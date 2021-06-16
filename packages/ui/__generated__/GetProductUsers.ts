/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetProductUsers
// ====================================================

export interface GetProductUsers_productUsers_nodes {
  __typename: "ProductUser";
  id: string;
  firstName: string | null;
  lastName: string | null;
  email: string | null;
  lastSeenAt: any | null;
  signedUpAt: any | null;
  photo: string | null;
  browser: string | null;
  externalId: string | null;
  createdAt: any | null;
  updatedAt: any | null;
}

export interface GetProductUsers_productUsers {
  __typename: "PaginatedProductUser";
  nodes: (GetProductUsers_productUsers_nodes | null)[] | null;
  page: number | null;
  rows: number | null;
}

export interface GetProductUsers {
  productUsers: GetProductUsers_productUsers | null;
}

export interface GetProductUsersVariables {
  page?: number | null;
  limit?: number | null;
}
