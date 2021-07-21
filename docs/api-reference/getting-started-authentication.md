---
description: Performing Authenticated requests.
---

# Getting Started / Authentication

## Authentication

To use the API, login and [navigate to the Onboarding page](https://my.sequence.so/onboarding/node-sdk) to retrieve your access token.  

{% hint style="info" %}
This access token provides both **read** and **write** access to the Sequence APIs. 
{% endhint %}

### API Endpoints

There are two API endpoints you can use to interact with Sequence:

#### GraphQL

* Purpose: Manipulating the internals of Campaigns, fetching Events, updating Users, creating Emails.
* Endpoint: `https://api.sequence.so/graphql`

**HTTP API**

* Purpose: Webhooks for data import and integration with 3rd party tools
* Endpoint: `https://api.sequence.so/`
* [View the import API here](segment/)



### Formatting Requests

Both APIs accept **Basic Authentication** in their respective endpoints.

{% hint style="info" %}
Basic Authentication requires that you have a username and password combo, place a colon between them, base64 encode the string, and pass that to the HTTP header as `Authorization: Token`. Read the example below for a quick copy/paste solution.
{% endhint %}

#### Sample GraphQL Request **to Fetch the Current User**

```typescript
import fetch from 'node-fetch';

// 1. Get token from onboarding: https://my.sequence.so/onboarding/node-sdk
const basicUsername = "[MY_ACCESS_TOKEN]";

// 2. Base64 encode as `username:password` (password is empty)
const token = Buffer.from(basicUsername + ":").toString("base64");

// 3. Add your token to `Authorization` in the header
fetch('https://api.sequence.so/graphql', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Basic ${token}`,
  },
  body: JSON.stringify({
    query: `
        query GetUser {
          getUser {
            id
            firstName
            lastName
            email
          }
        }
      `,
    variables: {
      // put variables here if you need them
    },
  }),
})
  .then((res) => res.json())
  .then((result) => console.log(result));

```

The response should look something like:

```javascript
{
  data: {
    getUser: {
      id: 'b212f47a-6c3b-4931-b1cc-fad6a808598a',
      firstName: 'Demo',
      lastName: 'User',
      email: 'demo@sequence.so'
    }
  }
}
```

{% hint style="info" %}
If you're making frequent calls to the GraphQL API, you'll probably want to use the [Apollo Client module](https://www.apollographql.com/apollo-client/) or a similar one to improve your developer experience.
{% endhint %}

