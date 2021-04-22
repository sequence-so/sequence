const { gql } = require("apollo-server-express");
const typeDefs = gql`
  scalar Date

  type AuthIntercom {
    id: ID
    isEnabled: Boolean
    createdAt: Date
    updatedAt: Date
  }
  type User {
    id: ID!
    firstName: String
    lastName: String
    email: String
    photo: String
    createdAt: Date
    updatedAt: Date
  }
  type Integrations {
    intercom: Boolean
  }
  type Query {
    getIntercom: AuthIntercom
    getUser: User
    getIntegrations: Integrations
  }
  type Mutation {
    saveIntercomCode(code: String!): AuthIntercom
  }
`;

export default typeDefs;
