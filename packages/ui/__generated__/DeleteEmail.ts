/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: DeleteEmail
// ====================================================

export interface DeleteEmail_deleteEmail {
  __typename: "DeleteResult";
  success: string | null;
}

export interface DeleteEmail {
  deleteEmail: DeleteEmail_deleteEmail | null;
}

export interface DeleteEmailVariables {
  id: string;
}
