# Running From Source

### Building Sequence

**Requirements**

* Node version 14 and greater
* Postgres version 11 and greater

**Recommended**

* A Sendgrid API Key to send emails
* Read `/packages/api/.env.example` to configure your environment variables.

Setting up Sequence with **Docker Compose** is easy:

```
git clone https://github.com/sequence-so/sequence
cd sequence
./build/copy_env # Copy sample environment variables
docker compose up
```

Open `http://0.0.0.0:8000` to see the application.

If you'd like to run the application in development mode:

```text
git clone https://github.com/sequence-so/sequence
cd sequence
yarn bootstrap
./build/copy_env
yarn dev
```

Please reach out if any errors occur at `support@sequence.so`.

