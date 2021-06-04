import {
  GraphQLList,
  GraphQLObjectType,
  GraphQLScalarType,
  Kind,
} from "graphql";
import { makeExecutableSchema } from "graphql-tools";
import { gql } from "apollo-server-express";
import resolvers from "./resolvers";

const GraphQLDate = new GraphQLScalarType({
  name: "Date",
  description: "Date custom scalar type",
  parseValue(value) {
    return new Date(value); // value from the client
  },
  serialize(value) {
    return value.toISOString(); // value sent to the client
  },
  parseLiteral(ast) {
    if (ast.kind === Kind.INT) {
      return new Date(ast.value); // ast value is always in string format
    }
    return null;
  },
});

const dates = {
  createdAt: {
    type: GraphQLDate,
  },
  updatedAt: {
    type: GraphQLDate,
  },
};

const typeDefs = gql`
  scalar Date
  scalar JSONObject

  type AuthDiscord {
    id: ID!
    userId: ID!
    webhookId: String
    expiresAt: Date
    createdAt: Date
    updatedAt: Date
  }
  type Audience {
    id: ID!
    name: String
    node: String
    count: Int
    productUsers: [ProductUser]
    createdAt: Date
    updatedAt: Date
    executedAt: Date
  }
  type AuthIntercom {
    id: ID!
    isEnabled: Boolean
    createdAt: Date
    updatedAt: Date
  }
  type Campaign {
    id: ID!
    name: String
    sentAt: Date
    userId: ID!
    emailId: ID
    audienceId: ID
    user: User
    email: Email
    audience: Audience
    createdAt: Date
    updatedAt: Date
  }
  type CustomProperty {
    id: ID
    key: String
    label: String
    propertyType: String
  }
  type DeleteResult {
    success: String
  }
  type Email {
    id: ID!
    name: String
    from: String
    fromName: String
    bodyHtml: String
    subject: String
    sentCount: Int
    userId: ID!
    user: User
    createdAt: Date
    updatedAt: Date
  }
  type Event {
    id: ID!
    name: String
    type: String
    source: String
    distinctId: String
    properties: JSONObject
    productUser: ProductUser
    createdAt: Date
    updatedAt: Date
  }
  type PostgresDatabase {
    id: ID!
    type: String
    username: String
    port: Int
    hostname: String
    schema: String
  }
  type Integrations {
    intercom: Boolean
    segment: Boolean
    postgres: Boolean
    discord: Boolean
    node: Boolean
  }
  type QueryResult {
    result: String
  }
  type PostgresSchema {
    schema: String
    name: String
    type: String
    owner: String
  }
  type PaginatedAudience {
    nodes: [Audience]
    page: Int
    rows: Int
  }
  type PaginatedCampaign {
    nodes: [Campaign]
    page: Int
    rows: Int
  }
  type PaginatedEmails {
    nodes: [Email]
    page: Int
    rows: Int
  }
  type PaginatedEvent {
    nodes: [Event]
    page: Int
    rows: Int
  }
  type PaginatedProductUser {
    nodes: [ProductUser]
    page: Int
    rows: Int
  }
  type ProductUser {
    id: ID!
    firstName: String
    lastName: String
    email: String
    photo: String
    phone: String
    signedUpAt: Date
    lastSeenAt: Date
    browser: String
    browserVersion: String
    browserLanguage: String
    os: String
    country: String
    region: String
    city: String
    title: String
    websiteUrl: String
    companyName: String
    industry: String
    intercomId: String
    externalId: String
    userId: ID
    user: User
    createdAt: Date
    updatedAt: Date
  }
  type SegmentWebhook {
    id: ID!
    token: String
    receivedDataAt: Date
    createdAt: Date
    updatedAt: Date
  }
  type SequenceWebhook {
    id: ID!
    token: String
    receivedDataAt: Date
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
    audiences(id: ID, page: Int, limit: Int): PaginatedAudience
    campaigns(id: ID, page: Int, limit: Int): PaginatedCampaign
    customProperties: [CustomProperty]
    emails(id: ID, page: Int, limit: Int): PaginatedEmails
    events(id: ID, page: Int, limit: Int, distinctId: ID): PaginatedEvent
    getChannelWebhooks: QueryResult
    getDatabases: [PostgresDatabase]
    getIntegrations: Integrations
    getIntercom: AuthIntercom
    getPostgresSchema: [PostgresSchema]
    getSegmentWebhook: SegmentWebhook
    getUser: User
    productUsers(page: Int, limit: Int): PaginatedProductUser
    uniqueEventNames: [String]
  }
  type Mutation {
    createAudience(name: String!, node: String!): Audience
    createCampaign(name: String, emailId: ID, audienceId: ID): Campaign
    createEmail(
      name: String
      bodyHtml: String
      bodyText: String
      subject: String
      from: String
      fromName: String
    ): Email
    createPostgresDatabase(
      username: String
      password: String
      port: Int
      hostname: String
      schema: String
      database: String
      ssl: Boolean
    ): PostgresDatabase
    createSegmentWebhook: SegmentWebhook
    createSequenceWebhook: SequenceWebhook
    deleteEmail(id: ID!): DeleteResult
    executeAudience(audience: String): PaginatedProductUser
    executeDatabaseQuery(query: String, databaseId: String): QueryResult
    saveDiscordCode(code: String!): AuthDiscord
    saveIntercomCode(code: String!): AuthIntercom
    updateAudience(id: ID!, name: String, node: String): Audience
    updateCampaign(name: String, emailId: ID, audienceId: ID): Campaign
    updateEmail(
      id: ID!
      name: String
      bodyHtml: String
      bodyText: String
      subject: String
      from: String
      fromName: String
    ): Email
  }
`;

export default typeDefs;
