import { gql } from "@apollo/client";

export const GET_EMAILS = gql`
  query GetEmails {
    emails {
      page
      rows
      nodes {
        id
        name
        from
        fromName
        bodyHtml
        kind
        subject
        localTo
        sentCount
        createdAt
        updatedAt
      }
    }
  }
`;

export const GET_EMAIL_BY_ID = gql`
  query GetEmailsById($id: ID, $localTo: String) {
    emails(id: $id, localTo: $localTo) {
      page
      rows
      nodes {
        id
        name
        from
        fromName
        bodyHtml
        kind
        subject
        localTo
        sentCount
        createdAt
        updatedAt
        deletedAt
      }
    }
  }
`;

export const CREATE_EMAIL = gql`
  mutation CreateEmail(
    $name: String
    $bodyHtml: String
    $bodyText: String
    $subject: String
    $from: String
    $fromName: String
    $localTo: String
  ) {
    createEmail(
      name: $name
      bodyHtml: $bodyHtml
      bodyText: $bodyText
      subject: $subject
      from: $from
      fromName: $fromName
      localTo: $localTo
    ) {
      id
      name
      from
      fromName
      bodyHtml
      kind
      subject
      localTo
      sentCount
      createdAt
      updatedAt
    }
  }
`;

export const UPDATE_EMAIL = gql`
  mutation UpdateEmail(
    $id: ID!
    $name: String
    $bodyHtml: String
    $bodyText: String
    $subject: String
    $from: String
    $fromName: String
    $kind: String
  ) {
    updateEmail(
      id: $id
      name: $name
      bodyHtml: $bodyHtml
      bodyText: $bodyText
      subject: $subject
      from: $from
      fromName: $fromName
      kind: $kind
    ) {
      id
      name
      from
      fromName
      kind
      bodyHtml
      subject
      sentCount
      createdAt
    }
  }
`;

export const DELETE_EMAIL = gql`
  mutation DeleteEmail($id: ID!) {
    deleteEmail(id: $id) {
      success
    }
  }
`;

export const SEND_TEST_EMAIL = gql`
  mutation SendTestEmail($emailId: ID!, $to: String!) {
    sendTestEmail(emailId: $emailId, to: $to) {
      success
    }
  }
`;
