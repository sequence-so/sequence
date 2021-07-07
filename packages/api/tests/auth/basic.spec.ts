import { gql } from "apollo-server-express";
import { expect } from "chai";
import {
  createTestClient,
  TestQuery,
  TestSetOptions,
} from "apollo-server-integration-testing";
import App from "src/app";
import User from "src/models/user.model";
import userSeed from "tests/seeds/user.seed";
import SequenceWebhook from "src/models/sequenceWebhook.model";
import sequenceWebhookSeed from "tests/seeds/sequenceWebhook.seed";

let app: App;
let user: User;
let sequenceWebhook: SequenceWebhook;
let query: TestQuery;
let mutate: TestQuery;
let setOptions: TestSetOptions;

describe("basic authentication", function () {
  before(async () => {
    app = new App();
    user = await userSeed({
      firstName: "Test",
      lastName: "User",
    });
    sequenceWebhook = await sequenceWebhookSeed({
      userId: user.id,
      token: "my_token_here",
    });
    const result = createTestClient({
      //@ts-ignore
      apolloServer: app.apolloServer,
    });
    query = result.query;
    mutate = result.mutate;
    setOptions = result.setOptions;
  });

  it("should reject bad API token provided", async () => {
    setOptions({
      request: {
        headers: {
          authorization: "Basic my_invalid_token",
        },
      },
    });
    try {
      await query(gql`
        query TestQuery {
          getUser {
            firstName
            lastName
          }
        }
      `);
    } catch (error) {
      expect(error).toMatchSnapshot();
    }
  });
  it("should accept a token", async () => {
    const token = Buffer.from(sequenceWebhook.token + ":").toString("base64");
    setOptions({
      request: {
        headers: {
          authorization: `Basic ${token}`,
        },
      },
    });
    try {
      const result = await query(gql`
        query TestQuery {
          getUser {
            firstName
            lastName
          }
        }
      `);
      expect(result).toMatchSnapshot();
    } catch (error) {
      expect(error).to.be.undefined;
    }
  });
});
