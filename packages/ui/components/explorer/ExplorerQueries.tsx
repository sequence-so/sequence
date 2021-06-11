import { gql } from "@apollo/client";

export const GET_PRODUCT_USERS = gql`
  query GetProductUsers($page: Int, $limit: Int) {
    productUsers(page: $page, limit: $limit) {
      nodes {
        id
        firstName
        lastName
        email
        lastSeenAt
        signedUpAt
        photo
        browser
        externalId
        createdAt
        updatedAt
      }
      page
      rows
    }
  }
`;

export const GET_PRODUCT_USER = gql`
  query GetProductUser($id: String) {
    productUsers(id: $id) {
      nodes {
        id
        firstName
        lastName
        email
        lastSeenAt
        signedUpAt
        photo
        traits
        browser
        externalId
        createdAt
        updatedAt
      }
      page
      rows
    }
  }
`;
