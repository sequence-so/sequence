/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: UpdateEmail
// ====================================================

export interface UpdateEmail_updateEmail {
  __typename: "Email";
  id: string;
  name: string | null;
  from: string | null;
  fromName: string | null;
  kind: string | null;
  bodyHtml: string | null;
  subject: string | null;
  sentCount: number | null;
  createdAt: any | null;
}

export interface UpdateEmail {
  updateEmail: UpdateEmail_updateEmail | null;
}

export interface UpdateEmailVariables {
  id: string;
  name?: string | null;
  bodyHtml?: string | null;
  bodyText?: string | null;
  subject?: string | null;
  from?: string | null;
  fromName?: string | null;
  kind?: string | null;
}
