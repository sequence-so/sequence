/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: CreateEmail
// ====================================================

export interface CreateEmail_createEmail {
  __typename: "Email";
  id: string;
  bodyHtml: string | null;
}

export interface CreateEmail {
  createEmail: CreateEmail_createEmail | null;
}

export interface CreateEmailVariables {
  name?: string | null;
  bodyHtml?: string | null;
  bodyText?: string | null;
  subject?: string | null;
  from?: string | null;
  fromName?: string | null;
}
