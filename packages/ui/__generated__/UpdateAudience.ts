/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: UpdateAudience
// ====================================================

export interface UpdateAudience_updateAudience {
  __typename: "Audience";
  id: string;
  name: string | null;
  node: string | null;
  count: number | null;
  createdAt: any | null;
  updatedAt: any | null;
  executedAt: any | null;
}

export interface UpdateAudience {
  updateAudience: UpdateAudience_updateAudience | null;
}

export interface UpdateAudienceVariables {
  id: string;
  name?: string | null;
  node?: string | null;
  localTo?: string | null;
}
