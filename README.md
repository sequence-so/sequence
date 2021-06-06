---
description: Setting up Sequence.
---

# Quickstart

## Quick Start

Setting up Sequence with **Docker Compose** is easy:

```
./build/copy_env # Copy sample environment variables
docker compose up
```

Open `http://0.0.0.0:8000` to see the application.

#### **What's Next**

Read about importing data to begin using Sequence.

{% page-ref page="importing-data.md" %}

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



