/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: ExecuteAudience
// ====================================================

export interface ExecuteAudience_executeAudience_nodes {
  __typename: "ProductUser";
  id: string;
  firstName: string | null;
  lastName: string | null;
  email: string | null;
  photo: string | null;
  phone: string | null;
  signedUpAt: any | null;
  lastSeenAt: any | null;
  browser: string | null;
  browserVersion: string | null;
  browserLanguage: string | null;
  os: string | null;
  country: string | null;
  region: string | null;
  city: string | null;
  title: string | null;
  websiteUrl: string | null;
  companyName: string | null;
  industry: string | null;
  intercomId: string | null;
  externalId: string | null;
}

export interface ExecuteAudience_executeAudience {
  __typename: "PaginatedProductUser";
  page: number | null;
  rows: number | null;
  nodes: (ExecuteAudience_executeAudience_nodes | null)[] | null;
}

export interface ExecuteAudience {
  executeAudience: ExecuteAudience_executeAudience | null;
}

export interface ExecuteAudienceVariables {
  audience?: string | null;
}
