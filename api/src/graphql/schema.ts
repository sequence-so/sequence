const { gql } = require("apollo-server-express");
const typeDefs = gql`
  scalar Date

  type AuthIntercom {
    id: ID
    isEnabled: Boolean
    createdAt: Date
    updatedAt: Date
  }
  type SegmentWebhook {
    id: ID
    token: String
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
    segment: Boolean
  }
  type Query {
    getIntercom: AuthIntercom
    getUser: User
    getIntegrations: Integrations
    getSegmentWebhook: SegmentWebhook
  }
  type Mutation {
    saveIntercomCode(code: String!): AuthIntercom
    createSegmentWebhook: SegmentWebhook
  }
`;

export default typeDefs;
