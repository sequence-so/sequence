import { expect } from "chai";
import fetch from "node-fetch";
import App from "src/app";
import { SegmentIdentify, SegmentTrack } from "src/events";
import Event from "src/models/event.model";
import ProductUser from "src/models/productUser.model";
import SegmentWebhook from "src/models/segmentWebhook.model";
import User from "src/models/user.model";
import sequenceWebhookSeed from "tests/seeds/sequenceWebhook.seed";
import userSeed from "tests/seeds/user.seed";
import {
  courseClicked,
  identify1,
  ecommerceOrderCompleted,
  trackExperimentViewed,
  identify3,
  identify2,
} from "./eventData";

let user: User;
let webhook: SegmentWebhook;
let app: App;

describe("sequence webhook", () => {
  before(async () => {
    user = await userSeed();
    webhook = await sequenceWebhookSeed({
      userId: user.id,
    });
    app = new App({
      port: 3000,
    });
    await app.listen();
  });
  after(async () => {
    await Event.destroy({
      where: {
        userId: user.id,
      },
      force: true,
    });
    await ProductUser.destroy({
      where: {
        userId: user.id,
      },
      force: true,
    });
    await user.destroy();
    await webhook.destroy();
    app.getServer().close();
  });

  const performAPI = async (
    data: any,
    url = "http://localhost:3000/event/batch"
  ) => {
    // 1. Get Token from onboarding page
    const basicUsername = webhook.token;

    // 2. Base64 encode the Username:Password (password is empty)
    const token = Buffer.from(basicUsername + ":").toString("base64");

    // 3. Add your token to `Authorization` in the header
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${token}`,
      },
      body: JSON.stringify(data),
    });
    const json = await res.json();
    return json;
  };

  describe("sequence import", () => {
    it("Course Clicked- Intro to Analytics", async () => {
      const payload = { ...courseClicked, sentAt: new Date().toUTCString() };
      const result = await performAPI({
        batch: [payload as SegmentTrack],
      });
      expect(result).toMatchSnapshot();
      const event = await Event.findOne({
        where: {
          messageId: courseClicked.messageId,
          userId: user.id,
        },
      });
      expect(payload.context).to.deep.eq(event.context);
      expect(payload.properties).to.deep.eq(event.properties);
    });
  });
  describe("identify", () => {
    it("Identify 1", async () => {
      const payload = { ...identify1, sentAt: new Date().toUTCString() };
      const result = await performAPI({
        batch: [payload as SegmentIdentify],
      });
      expect(result).toMatchSnapshot();
      const person = await ProductUser.findOne({
        where: {
          externalId: payload.userId,
          userId: user.id,
        },
      });
      expect(payload.traits.firstName).to.deep.eq(person.firstName);
      expect(payload.traits.lastName).to.deep.eq(person.lastName);
    });
  });

  describe("mixed", () => {
    it("batch import many with idempotency", async () => {
      const result1 = await performAPI({
        batch: [
          ecommerceOrderCompleted,
          trackExperimentViewed,
          identify2,
          identify3,
        ],
      });
      expect(result1).toMatchSnapshot();
      const result2 = await performAPI({
        batch: [
          ecommerceOrderCompleted,
          trackExperimentViewed,
          identify2,
          identify3,
        ],
      });
      expect(result2).toMatchSnapshot();
    });
  });

  it("should create a user", async () => {
    const userData = {
      firstName: "Wei",
      lastName: "James",
      email: "pifagor@example.me",
      plan: "premium",
      logins: 5,
      myCustomAttribute: "testing",
      externalId: "kfzKyjdURh",
    };
    const result = await performAPI(userData, "http://localhost:3000/user");
    delete result.batch[0].messageId;
    expect(result).toMatchSnapshot();
  });
});
