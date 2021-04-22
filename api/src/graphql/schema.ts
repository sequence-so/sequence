const { gql } = require("apollo-server-express");
const typeDefs = gql`
  scalar Date

  type AuthIntercom {
    id: ID!
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
  type Query {
    getIntercom: AuthIntercom
    getUser: User
  }
  type Mutation {
    saveIntercomCode(code: String!): AuthIntercom
  }
`;

export default typeDefs;
