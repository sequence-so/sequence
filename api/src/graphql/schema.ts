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
    receivedDataAt: Date
    createdAt: Date
    updatedAt: Date
  }
  type PostgresDatabase {
    id: ID
    username: String
    password: String
    port: Int
    hostname: String
    schema: String
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
    postgres: Boolean
  }
  type QueryResult {
    result: String
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
    createPostgresDatabase(
      username: String
      password: String
      port: Int
      hostname: String
      schema: String
      database: String
      ssl: Boolean
    ): PostgresDatabase
    executeDatabaseQuery(query: String): QueryResult
  }
`;

export default typeDefs;
