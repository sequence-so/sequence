/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: CreateBlast
// ====================================================

export interface CreateBlast_createBlast {
  __typename: "Blast";
  id: string;
  name: string | null;
  sentAt: any | null;
  userId: string;
  emailId: string | null;
  audienceId: string | null;
  createdAt: any | null;
  updatedAt: any | null;
}

export interface CreateBlast {
  createBlast: CreateBlast_createBlast | null;
}

export interface CreateBlastVariables {
  name?: string | null;
  emailId?: string | null;
  audienceId?: string | null;
}
