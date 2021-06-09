# Sequence
Sequence is an open source email marketing automation tool. 


![Image of Sequence](./docs/.gitbook/assets/my-movie-4.gif)

## Features
- **Segment your customers** by Events or User Attributes via our Audience Builder
- **Send targeted emails** to your Audiences
- **Search and filter through customer data** from multiple sources (Segment, API, SDK, with Intercom and CSV coming soon)
- **API first** with a GraphQL API and HTTP API

## Quick Start

Set up Sequence with **Docker Compose**:

```
./build/copy_env # Copy sample environment variables
docker compose up
```

Open `http://0.0.0.0:8000` to see the application.

## **What's Next**

[Read about importing data to begin using Sequence.](https://sequence.gitbook.io/sequence/node-sdk/node-sdk)

[Read our Documentation here.](https://sequence.gitbook.io/sequence/node-sdk/node-sdk)
## Building Sequence

**Requirements**

* Node version 14 and greater
* Postgres version 11 and greater

**Recommended**

* A Sendgrid API Key to send emails
* Read `/packages/api/.env.example` to configure your environment variables.

```text
git clone https://github.com/sequence-so/sequence
cd sequence
yarn bootstrap
./build/copy_env
yarn dev
```

Please reach out if any errors occur at `support@sequence.so`.
