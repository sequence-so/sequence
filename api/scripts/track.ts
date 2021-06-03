const app = require("../src/app").default;
import SequenceWebhookRoute from "../src/routes/sequenceWebhook.http";
import { v4 as uuidv4 } from "uuid";
import SequenceWebhook from "../src/models/sequence_webhook";
import moment from "moment";

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
  let route = new SequenceWebhookRoute(app);
  const hook = await SequenceWebhook.findOne();

  const createEvent = () => ({
    type: "track",
    name: eventNames[Math.floor(Math.random() * eventNames.length)],
    distinctId: "6319fea8-80d1-4488-8a7b-2d524e3c1f2f",
    properties: {
      $library: "1",
      $libraryVersion: "1",
      bullshit: "yes",
      DoIt: 123,
      hithere: 123.55,
      boy: null as any,
    },
    messageId: uuidv4(),
    timestamp: moment().format("YYYY-MM-DD HH:MM:SS"),
  });

  route.onEvent(
    {
      body: {
        batch: Array.from({ length: 40 }, () => createEvent()),
      },
      headers: {
        authorization: `Bearer ${hook.token}`,
      },
    } as any,
    {
      json: () => {},
    } as any
  );
};

runTest();
