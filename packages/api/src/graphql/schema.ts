import { gql } from "apollo-server-express";

const typeDefs = gql`
  scalar Date
  scalar JSONObject

  type Audience {
    id: ID!
    name: String
    node: String
    count: Int
    localTo: String
    productUsers: [ProductUser]
    createdAt: Date
    updatedAt: Date
    executedAt: Date
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
  type Campaign {
    id: ID!
    name: String
    state: String
    isDraft: Boolean
    userId: ID
    user: User
    campaignNodes: [CampaignNode]
    campaignNodeEdges: [CampaignNodeEdge]
    launchedAt: Date
    stoppedAt: Date
    createdAt: Date
    updatedAt: Date
  }
  type CampaignNode {
    id: ID!
    name: String
    kind: String
    json: JSONObject
    positionX: Int
    positionY: Int
    timeoutAfter: Int
    userId: ID
    campaignId: ID
    user: User
    campaign: Campaign
    campaignNodeStates: [CampaignNodeState]
    createdAt: Date
    updatedAt: Date
  }
  type CampaignNodeEdge {
    id: ID!
    edgeKind: String
    from: CampaignNode
    fromId: ID
    to: CampaignNode
    toId: ID
    createdAt: Date
    updatedAt: Date
  }
  type CampaignNodeState {
    id: ID!
    state: String
    didTimeout: Boolean
    attempts: Int
    userId: String
    campaignId: ID
    productUserId: String
    campaignNodeId: String
    runAt: Date
    timeoutAt: Date
    completedAt: Date
    user: User
    campaign: Campaign
    productUser: ProductUser
    campaignNode: CampaignNode
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
    kind: String
    fromName: String
    bodyHtml: String
    subject: String
    localTo: String
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
  type PaginatedCampaigns {
    nodes: [Campaign]
    page: Int
    rows: Int
  }
  type PaginatedCampaignNodes {
    nodes: [CampaignNode]
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
  type OperationResult {
    success: Boolean
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
    # Fetch all Blasts, or Blasts with a specific ID.
    # Arguments:
    # id: ID of a specific Audience
    # localTo: "campaigns" if requesting Audiences created inside of a Campaign or blank for default Audiences
    # page: Page number
    # limit: Total page size
    audiences(id: ID, localTo: String, page: Int, limit: Int): PaginatedAudience
    # Fetch all Blasts, or Blasts with a specific ID.
    # Arguments:
    # id: ID of a Blast
    # page: Page number
    # limit: Total page size
    blasts(id: ID, page: Int, limit: Int): PaginatedBlast
    # Fetch all Campaigns, or Campaigns with a specific ID.
    # Arguments:
    # id: ID of a Campaign
    # page: Page number
    # limit: Total page size
    campaigns(id: ID, page: Int, limit: Int): PaginatedCampaigns
    # CampaignNodes is a Block in a Campaign. Fetch all CampaignNodes, or CampaignNodes with a specific ID.
    # Arguments:
    # id: ID of a CampaignNode
    # page: Page number
    # limit: Total page size
    campaignNodes(id: ID, page: Int, limit: Int): PaginatedCampaignNodes
    # Fetch all Emails, or Emails with a specific ID.
    # Arguments:
    # id: ID of a specific Audience
    # localTo: "campaigns" if requesting Emails created inside of a Campaign or blank for default Emails
    # page: Page number
    # limit: Total page size
    emails(id: ID, page: Int, limit: Int, localTo: String): PaginatedEmails
    # Fetch all Events, or Events with a specific ID.
    # Arguments:
    # id: ID of a specific Event
    # personId: Match on associated personId (external UUID provided by user)
    # page: Page number
    # limit: Total page size
    events(id: ID, personId: ID, page: Int, limit: Int): PaginatedEvent
    getSegmentWebhook: SegmentWebhook
    # Gets the current authenticated user
    getUser: User
    integrations: Integrations
    # Fetch all ProductUsers, or ProductUsers with a specific ID.
    # Arguments:
    # id: ID of a specific ProductUser
    # page: Page number
    # limit: Total page size
    productUsers(id: String, page: Int, limit: Int): PaginatedProductUser
    # Get all unique event names for the authenticated User account.
    uniqueEventNames: [String]
  }
  type Mutation {
    connectCampaignNodes(
      id: ID
      fromId: String!
      toId: String!
      edgeKind: String!
    ): CampaignNodeEdge
    createAudience(name: String!, node: String!, localTo: String): Audience
    createBlast(name: String, emailId: ID, audienceId: ID): Blast
    createCampaign(name: String): Campaign
    createCampaignNode(
      id: ID
      name: String
      kind: String!
      json: JSONObject
      positionX: Int
      positionY: Int
      timeoutAfter: Int
      campaignId: ID!
    ): CampaignNode
    createEmail(
      name: String
      bodyHtml: String
      bodyText: String
      subject: String
      from: String
      fromName: String
      localTo: String
      kind: String
    ): Email
    createSegmentWebhook: SegmentWebhook
    createSequenceWebhook: SequenceWebhook
    deleteCampaignNode(id: ID!): DeleteResult
    deleteCampaignNodeEdge(id: ID!): DeleteResult
    deleteEmail(id: ID!): DeleteResult
    executeAudience(audience: String): PaginatedProductUser
    launchCampaign(id: ID!): Campaign
    sendTestEmail(emailId: ID!, to: String!): OperationResult
    stopCampaign(id: ID!): Campaign
    updateAudience(
      id: ID!
      name: String
      node: String
      localTo: String
    ): Audience
    updateBlast(name: String, emailId: ID, audienceId: ID): Blast
    updateCampaign(id: ID!, name: String): Campaign
    updateCampaignNode(
      id: ID!
      name: String
      kind: String
      json: JSONObject
      positionX: Int
      positionY: Int
      timeoutAfter: Int
    ): CampaignNode
    updateEmail(
      id: ID!
      name: String
      bodyHtml: String
      bodyText: String
      subject: String
      from: String
      fromName: String
      kind: String
    ): Email
    updateUser(firstName: String, lastName: String, onboardedAt: Date): User
  }
`;

export default typeDefs;
