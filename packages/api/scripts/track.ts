import App from "src/app";
import SequenceHttpHandler from "../src/routes/sequence.http";
import { v4 as uuidv4 } from "uuid";
import SequenceWebhook from "../src/models/sequenceWebhook.model";
import moment from "moment";
import Tracker, { EventPayload } from "sequence-node";
import { deleteProductUser } from "src/graphql/mutations/productUser.mutation";
import User from "src/models/user.model";

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

// const runTest = async () => {
//   const route = new SequenceHttpHandler(app);
//   const hook = await SequenceWebhook.findOne();

//   const createEvent = (): EventPayload => ({
//     type: "track",
//     event: eventNames[Math.floor(Math.random() * eventNames.length)],
//     userId: "6319fea8-80d1-4488-8a7b-2d524e3c1f2f",
//     properties: {
//       bullshit: "yes",
//       DoIt: 123,
//       hithere: 123.55,
//       boy: null as any,
//     },
//     messageId: uuidv4(),
//     timestamp: new Date(),
//     context: {},
//     receivedAt: null,
//     sentAt: new Date(),
//   });

//   // route.onEvent(
//   //   {
//   //     body: {
//   //       batch: Array.from({ length: 40 }, () => createEvent()),
//   //     },
//   //     headers: {
//   //       authorization: `Bearer ${hook.token}`,
//   //     },
//   //   } as any,
//   //   {
//   //     json: () => {},
//   //   } as any
//   // );
// };

const runTest2 = async () => {
  let app = new App();
  const token = "bf1ef318deb92d3334d38ef5401cbee590c7";
  const webhook = await app.getModels().SequenceWebhook.findOne({
    where: {
      token: token,
    },
    include: [
      {
        model: User,
        as: "user",
      },
    ],
  });
  const client = new Tracker(token, {
    host: "http://localhost:3000",
  });
  client.identify(
    {
      userId: "grouparoo",
      traits: {},
    },
    async (err, data) => {
      console.log(data);
      await deleteProductUser(
        null,
        {
          customerId: "grouparoo",
        },
        {
          app,
          repositories: app.getRepositories(),
          user: webhook.user,
          models: app.getModels(),
        }
      );
    }
  );
};
runTest2();
