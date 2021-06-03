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
  "Song Favorited",
  "Radio Played",
  "Playlist Shared",
  "Playlist Created",
];

const runTest = async () => {
  let route = new SequenceWebhookRoute(app);
  const hook = await SequenceWebhook.findOne();

  const createEvent = () => ({
    type: "event",
    name: eventNames[Math.floor(Math.random() * eventNames.length)],
    distinctId: uuidv4(),
    properties: {
      $library: "1",
      $libraryVersion: "1",
      bullshit: "yes",
    },
    messageId: uuidv4(),
    timestamp: moment().format("YYYY-MM-DD HH:MM:SS"),
  });

  route.onEvent(
    {
      body: {
        batch: Array.from({ length: 100 }, () => createEvent()),
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
