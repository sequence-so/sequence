import { expect } from "chai";
import fetch from "node-fetch";
import App from "src/app";
import SequenceWebhook from "src/models/sequenceWebhook.model";
import User from "src/models/user.model";
import sequenceWebhookSeed from "tests/seeds/sequenceWebhook.seed";
import userSeed from "tests/seeds/user.seed";

let user: User;
let sequenceWebhook: SequenceWebhook;
let app: App;

describe("simple api test", () => {
  before(async () => {
    user = await userSeed();
    sequenceWebhook = await sequenceWebhookSeed({
      userId: user.id,
    });
    app = new App({ port: 3000 });
    await app.listen();
  });
  after(async () => {
    await user.destroy();
    await sequenceWebhook.destroy();
    app.getServer().close();
  });
  it("should run a graphql query", async () => {
    // 1. Get Token from onboarding page
    const basicUsername = sequenceWebhook.token;

    // 2. Base64 encode the Username:Password (password is empty)
    const token = Buffer.from(basicUsername + ":").toString("base64");

    // 3. Add your token to `Authorization` in the header
    const res = await fetch("http://localhost:3000/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
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
    });
    const json = await res.json();
    expect(json).to.deep.eq({
      data: {
        getUser: {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
        },
      },
    });
  });
});
