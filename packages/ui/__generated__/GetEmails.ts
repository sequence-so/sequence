/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetEmails
// ====================================================

export interface GetEmails_emails_nodes {
  __typename: "Email";
  id: string;
  name: string | null;
  from: string | null;
  fromName: string | null;
  bodyHtml: string | null;
  kind: string | null;
  subject: string | null;
  localTo: string | null;
  sentCount: number | null;
  createdAt: any | null;
  updatedAt: any | null;
}

export interface GetEmails_emails {
  __typename: "PaginatedEmails";
  page: number | null;
  rows: number | null;
  nodes: (GetEmails_emails_nodes | null)[] | null;
}

export interface GetEmails {
  emails: GetEmails_emails | null;
}
