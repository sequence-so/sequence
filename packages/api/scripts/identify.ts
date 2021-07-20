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
  "Song Favorited",
  "Radio Played",
  "Playlist Shared",
  "Playlist Created",
];

const runTest = async () => {
  const route = new SequenceHttpHandler(app);
  const hook = await SequenceWebhook.findOne();

  const createEvent = (): EventPayload => ({
    type: "identify",
    userId: uuidv4(),
    properties: {
      firstName: "John",
      lastName: "Doe",
      email: "john@doe.com",
    },
    messageId: uuidv4(),
    timestamp: new Date(),
    sentAt: new Date(),
    context: {},
    receivedAt: null,
  });

  // route.onEvent(
  //   {
  //     body: {
  //       batch: Array.from({ length: 1 }, () => createEvent()),
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
