import { gql } from "apollo-server-express";
import { expect } from "chai";
import { stub } from "sinon";
import {
  createTestClient,
  TestQuery,
  TestSetOptions,
} from "apollo-server-integration-testing";
import App from "src/app";
import User from "src/models/user.model";
import { signJwt } from "src/utils/signJwt";
import userSeed from "tests/seeds/user.seed";

let app: App;
let user: User;
let jwt: string;
let query: TestQuery;
let mutate: TestQuery;
let setOptions: TestSetOptions;

describe("jwt authentication", function () {
  before(async () => {
    app = new App();
    user = await userSeed({
      firstName: "Test",
      lastName: "User",
    });
    jwt = await signJwt(user);
    const result = createTestClient({
      //@ts-ignore
      apolloServer: app.apolloServer,
    });
    query = result.query;
    mutate = result.mutate;
    setOptions = result.setOptions;
  });

  it("should reject no token provided", async () => {
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
  it("should reject bad token provided", async () => {
    setOptions({
      request: {
        headers: {
          authorization: "Bearer my_invalid_token",
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
  it("should accept a JWT", async () => {
    setOptions({
      request: {
        headers: {
          authorization: `Bearer ${jwt}`,
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
