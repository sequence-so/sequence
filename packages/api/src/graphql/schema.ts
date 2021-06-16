import { GraphQLScalarType, Kind } from "graphql";
import { gql } from "apollo-server-express";

const typeDefs = gql`
  scalar Date
  scalar JSONObject

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
  type Blast {
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
    deletedAt: Date
  }
  type Event {
    id: ID!
    name: String
    type: String
    source: String
    personId: String
    properties: JSONObject
    productUser: ProductUser
    createdAt: Date
    updatedAt: Date
  }
  type Integrations {
    segment: Boolean
    node: Boolean
  }
  type PaginatedAudience {
    nodes: [Audience]
    page: Int
    rows: Int
  }
  type PaginatedBlast {
    nodes: [Blast]
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
    browser: String
    browserLanguage: String
    browserVersion: String
    city: String
    companyName: String
    country: String
    email: String
    externalId: String
    firstName: String
    industry: String
    intercomId: String
    lastName: String
    lastSeenAt: Date
    os: String
    phone: String
    photo: String
    region: String
    signedUpAt: Date
    traits: JSONObject
    title: String
    userId: ID
    websiteUrl: String
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
    onboardedAt: Date
    createdAt: Date
    updatedAt: Date
  }
  type Query {
    audiences(id: ID, page: Int, limit: Int): PaginatedAudience
    blasts(id: ID, page: Int, limit: Int): PaginatedBlast
    customProperties: [CustomProperty]
    emails(id: ID, page: Int, limit: Int): PaginatedEmails
    events(id: ID, page: Int, limit: Int, personId: ID): PaginatedEvent
    getIntercom: AuthIntercom
    getSegmentWebhook: SegmentWebhook
    getUser: User
    integrations: Integrations
    productUsers(id: String, page: Int, limit: Int): PaginatedProductUser
    uniqueEventNames: [String]
  }
  type Mutation {
    createAudience(name: String!, node: String!): Audience
    createBlast(name: String, emailId: ID, audienceId: ID): Blast
    createEmail(
      name: String
      bodyHtml: String
      bodyText: String
      subject: String
      from: String
      fromName: String
    ): Email
    createSegmentWebhook: SegmentWebhook
    createSequenceWebhook: SequenceWebhook
    deleteEmail(id: ID!): DeleteResult
    executeAudience(audience: String): PaginatedProductUser
    saveIntercomCode(code: String!): AuthIntercom
    updateAudience(id: ID!, name: String, node: String): Audience
    updateBlast(name: String, emailId: ID, audienceId: ID): Blast
    updateEmail(
      id: ID!
      name: String
      bodyHtml: String
      bodyText: String
      subject: String
      from: String
      fromName: String
    ): Email
    updateUser(firstName: String, lastName: String, onboardedAt: Date): User
  }
`;

export default typeDefs;
