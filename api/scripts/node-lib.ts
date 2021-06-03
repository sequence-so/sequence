require("../src/app");

import Sequence from "sequence-lib";

// console.log("key " + process.env.SEQUENCE_API_KEY);

const runTest = async () => {
  let sequence = new Sequence(process.env.SEQUENCE_API_KEY, {
    host: "http://localhost:3000",
  });
  // for (let idx = 0, len = 100; idx < len; idx++) {
  sequence.alert(
    "asdfjkasldfjlkj",
    {
      name: "Pizza Generated",
      message: "Tom has entered the building",
      properties: {
        firstName: "Oliver",
        lastName: "Takach",
      },
      notifications: {
        discord: {
          title: "API Key Generated",
          embeds: [
            {
              title: "do you thang girl",
              url: "https://sequence.so",
            },
            {
              title: "Do something else",
              url: "https://sequence.so",
            },
            {
              title: "A last thing",
              url: "https://sequence.so",
            },
          ],
        },
      },
    },
    (error, data) => {
      console.log({ error, data });
    }
  );
  // }
};

runTest();
