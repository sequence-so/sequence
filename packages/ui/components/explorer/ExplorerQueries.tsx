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
        browser
        browserLanguage
        browserVersion
        city
        companyName
        country
        email
        externalId
        firstName
        industry
        intercomId
        lastName
        lastSeenAt
        os
        phone
        photo
        region
        signedUpAt
        traits
        title
        userId
        websiteUrl
        createdAt
        updatedAt
      }
      page
      rows
    }
  }
`;
