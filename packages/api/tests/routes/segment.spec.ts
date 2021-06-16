import { expect } from "chai";
import Event from "src/models/event.model";
import ProductUser from "src/models/productUser.model";
import SegmentWebhook from "src/models/segmentWebhook.model";
import User from "src/models/user.model";
import SegmentProcessor from "src/services/segmentProcessor";
import segmentWebhookSeed from "tests/seeds/segmentWebhook.seed";
import userSeed from "tests/seeds/user.seed";
import { courseClicked, identify1 } from "./eventData";

let user: User;
let webhook: SegmentWebhook;

describe("segment", () => {
  before(async () => {
    user = await userSeed();
    webhook = await segmentWebhookSeed({
      userId: user.id,
    });
  });
  after(async () => {
    await Event.destroy({
      where: {
        userId: user.id,
      },
      force: true,
    });
    await user.destroy();
    await webhook.destroy();
  });
  const processor = new SegmentProcessor();

  describe("track", () => {
    it("Course Clicked- Intro to Analytics", async () => {
      const payload = courseClicked;
      const result = await processor.process(webhook, payload);
      expect(result.success).to.eq(true);
      const event = await Event.findOne({
        where: {
          messageId: courseClicked.messageId,
        },
      });
      expect(payload.context).to.deep.eq(event.context);
      expect(payload.properties).to.deep.eq(event.properties);
    });
  });
  describe("identify", () => {
    it("Identify 1", async () => {
      const payload = identify1;
      const result = await processor.process(webhook, payload);
      expect(result.success).to.eq(true);
      const person = await ProductUser.findOne({
        where: {
          externalId: payload.userId,
        },
      });
      expect(payload.traits.firstName).to.deep.eq(person.firstName);
      expect(payload.traits.lastName).to.deep.eq(person.lastName);
    });
  });
});
