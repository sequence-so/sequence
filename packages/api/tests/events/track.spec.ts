import { expect } from "chai";
import { track } from "src/events";
import userSeed from "tests/seeds/user.seed";
import { SEGMENT_WEBHOOK_ID } from "src/services/segmentProcessor";
import { v4 } from "uuid";
import User from "src/models/user.model";
import moment from "moment";
import Event from "src/models/event.model";

let user: User;
describe("track", () => {
  before(async () => {
    user = await userSeed();
  });

  it("should throw on invalid calls", async () => {
    expect(
      track(
        {
          type: "identify",
          event: "My Invalid Call",
          properties: {},
          context: {},
          sentAt: new Date(),
          timestamp: new Date(),
          messageId: v4(),
          receivedAt: new Date(),
          userId: v4(),
        },
        {
          userId: user.id,
          source: SEGMENT_WEBHOOK_ID,
          sourceId: "random-id",
        }
      )
    ).to.eventually.throw(
      `Wrong handler used for event type 'identify', expected 'track'`
    );
  });
  it("should save track calls", async () => {
    const timestamp = moment().subtract(2, "minute").toDate();
    const sentAt = moment().subtract(1, "minute").toDate();
    const receivedAt = new Date();
    const messageId = v4();
    const personId = v4();

    await track(
      {
        type: "track",
        event: "User Registered",
        properties: {
          firstName: "Mark",
          lastName: "Walhberg",
        },
        context: {
          device: {
            advertisingId: v4(),
            id: v4(),
            manufacturer: "Apple",
            model: "iPhone 42",
            type: "cellphone",
          },
        },
        sentAt,
        timestamp,
        receivedAt,
        messageId,
        userId: personId,
      },
      {
        userId: user.id,
        source: SEGMENT_WEBHOOK_ID,
        sourceId: "random-id",
      }
    );
    const event = await Event.findOne({
      where: {
        messageId,
      },
    });
    expect(event.type).to.eq("track");
    expect(event.name).to.eq("User Registered");
    expect(event.properties).to.deep.eq({
      firstName: "Mark",
      lastName: "Walhberg",
    });
    expect(event.sourceId).to.eq("random-id");
    expect(event.source).to.eq(SEGMENT_WEBHOOK_ID);
    expect(event.personId).to.eq(personId);
    expect(event.sentAt.getTime()).to.eq(sentAt.getTime());
    expect(event.receivedAt.getTime()).to.eq(receivedAt.getTime());
    expect(event.timestamp.getTime()).to.eq(timestamp.getTime());
  });
});
