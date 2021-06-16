import { gql } from "@apollo/client";

export const GET_BLAST = gql`
  query GetBlast($id: ID) {
    blasts(id: $id) {
      page
      rows
      nodes {
        id
        name
        sentAt
        userId
        emailId
        audience {
          productUsers {
            id
            firstName
            lastName
            email
            createdAt
            lastSeenAt
          }
        }
        audienceId
        createdAt
        updatedAt
      }
    }
  }
`;
