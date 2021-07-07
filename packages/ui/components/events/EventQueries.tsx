import { gql } from "@apollo/client";

export const GET_EVENTS = gql`
  query GetEvents($page: Int, $limit: Int, $personId: ID) {
    events(page: $page, limit: $limit, personId: $personId) {
      nodes {
        id
        name
        type
        source
        personId
        properties
        timestamp
        productUser {
          firstName
          lastName
        }
        createdAt
        updatedAt
      }
      page
      rows
    }
  }
`;
