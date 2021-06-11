/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: CreateAudience
// ====================================================

export interface CreateAudience_createAudience {
  __typename: "Audience";
  id: string;
  name: string | null;
  node: string | null;
  count: number | null;
  createdAt: any | null;
  updatedAt: any | null;
  executedAt: any | null;
}

export interface CreateAudience {
  createAudience: CreateAudience_createAudience | null;
}

export interface CreateAudienceVariables {
  name: string;
  node: string;
  localTo?: string | null;
}
