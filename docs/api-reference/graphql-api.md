# GraphQL API

### GraphQL API

Sequence uses a GraphQL API for frontend requests. You have access to that API too! 

You can find the [full schema reference here](https://github.com/sequence-so/sequence/blob/main/packages/api/src/graphql/schema.ts).

To use the API, login and get an Authorization token for your user. It will be accessible from your browser under `localStorage.token`. You can evaluate this expression in your console to get the value once you're logged in. Then in your request headers, add `Authorization: {token}`.

The API is available at `http://{sequence_api}/graphql`. We also expose the GraphQL explorer which has more schema details. 

### GraphQL Schema Reference

```text
type Query {
  audiences(id: ID, page: Int, limit: Int): PaginatedAudience
  campaigns(id: ID, page: Int, limit: Int): PaginatedCampaign
  customProperties: [CustomProperty]
  emails(id: ID, page: Int, limit: Int): PaginatedEmails
  events(id: ID, page: Int, limit: Int, personId: ID): PaginatedEvent
  getChannelWebhooks: QueryResult
  getIntercom: AuthIntercom
  getSegmentWebhook: SegmentWebhook
  getUser: User
  integrations: Integrations
  productUsers(id: String, page: Int, limit: Int): PaginatedProductUser
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
  createSegmentWebhook: SegmentWebhook
  createSequenceWebhook: SequenceWebhook
  deleteEmail(id: ID!): DeleteResult
  executeAudience(audience: String): PaginatedProductUser
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
```

