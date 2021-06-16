/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: SendTestEmail
// ====================================================

export interface SendTestEmail_sendTestEmail {
  __typename: "OperationResult";
  success: boolean | null;
}

export interface SendTestEmail {
  sendTestEmail: SendTestEmail_sendTestEmail | null;
}

export interface SendTestEmailVariables {
  emailId: string;
  to: string;
}
