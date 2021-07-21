# GraphQL API

### GraphQL API

Sequence uses a GraphQL API for frontend requests. You have access to that API too! 

You can find the [full schema reference here](https://github.com/sequence-so/sequence/blob/main/packages/api/src/graphql/schema.ts).

To use the API, login and get an Authorization token for your user. It will be accessible from your browser under `localStorage.token`. You can evaluate this expression in your console to get the value once you're logged in. Then in your request headers, add `Authorization: {token}`.

The API is available at `http://{sequence_api}/graphql`. We also expose the GraphQL explorer which has more schema details. 

### GraphQL Schema Reference

```text
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
```

