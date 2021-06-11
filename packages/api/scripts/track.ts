const app = require("../src/app").default;
import SequenceHttpHandler from "../src/routes/sequence.http";
import { v4 as uuidv4 } from "uuid";
import SequenceWebhook from "../src/models/sequenceWebhook.model";
import moment from "moment";
import { EventPayload } from "sequence-node";

const eventNames = [
  "User Created",
  "Song Played",
  "Song Deleted",
  "Friend Added",
  "Song Shared",
  " Song Favorited",
  "Radio Played",
  "Playlist Shared",
  "Playlist Created",
];

const runTest = async () => {
  const route = new SequenceHttpHandler(app);
  const hook = await SequenceWebhook.findOne();

  const createEvent = (): EventPayload => ({
    type: "track",
    event: eventNames[Math.floor(Math.random() * eventNames.length)],
    userId: "6319fea8-80d1-4488-8a7b-2d524e3c1f2f",
    properties: {
      bullshit: "yes",
      DoIt: 123,
      hithere: 123.55,
      boy: null as any,
    },
    messageId: uuidv4(),
    timestamp: new Date(),
    context: {},
    receivedAt: null,
    sentAt: new Date(),
  });

  // route.onEvent(
  //   {
  //     body: {
  //       batch: Array.from({ length: 40 }, () => createEvent()),
  //     },
  //     headers: {
  //       authorization: `Bearer ${hook.token}`,
  //     },
  //   } as any,
  //   {
  //     json: () => {},
  //   } as any
  // );
};

runTest();
