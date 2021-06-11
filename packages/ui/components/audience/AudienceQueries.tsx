import { gql } from "@apollo/client";

export const CREATE_AUDIENCE = gql`
  mutation CreateAudience($name: String!, $node: String!, $localTo: String) {
    createAudience(name: $name, node: $node, localTo: $localTo) {
      id
      name
      node
      count
      createdAt
      updatedAt
      executedAt
    }
  }
`;

export const UPDATE_AUDIENCE = gql`
  mutation UpdateAudience(
    $id: ID!
    $name: String
    $node: String
    $localTo: String
  ) {
    updateAudience(id: $id, name: $name, node: $node, localTo: $localTo) {
      id
      name
      node
      count
      createdAt
      updatedAt
      executedAt
    }
  }
`;

export const GET_AUDIENCES = gql`
  query GetAudiences {
    audiences {
      page
      rows
      nodes {
        id
        name
        node
        count
        executedAt
        createdAt
        updatedAt
      }
    }
  }
`;

export const GET_AUDIENCE_BY_ID = gql`
  query GetAudienceById($id: ID, $localTo: String) {
    audiences(id: $id, localTo: $localTo) {
      page
      rows
      nodes {
        id
        name
        node
        count
        createdAt
        updatedAt
        executedAt
      }
    }
  }
`;

export const GET_AUDIENCE_WITH_PRODUCT_USERS = gql`
  query GetAudienceWithProductUsers($id: ID) {
    audiences(id: $id) {
      page
      rows
      nodes {
        id
        name
        node
        productUsers {
          id
          firstName
          lastName
          email
          externalId
          createdAt
          lastSeenAt
        }
        createdAt
        updatedAt
        executedAt
      }
    }
  }
`;

export const EXECUTE_AUDIENCE = gql`
  mutation ExecuteAudience($audience: String) {
    executeAudience(audience: $audience) {
      page
      rows
      nodes {
        id
        firstName
        lastName
        email
        photo
        phone
        signedUpAt
        lastSeenAt
        browser
        browserVersion
        browserLanguage
        os
        country
        region
        city
        title
        websiteUrl
        companyName
        industry
        intercomId
        externalId
      }
    }
  }
`;
