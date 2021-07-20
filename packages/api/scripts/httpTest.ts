import fetch from "node-fetch";

// 1. Get token from https://my.sequence.so/onboarding/node-sdk
const basicUsername = "5a237edc72586ce9e47d55dcb31b0ae180c0";

// 2. Base64 encode the Username:Password (password is empty)
const token = Buffer.from(basicUsername + ":").toString("base64");

const data = {
  batch: [
    {
      type: "identify",
      traits: {
        firstName: "Wei",
        lastName: "James",
        email: "pifagor@example.me",
        plan: "premium",
        logins: 5,
      },
      userId: "2zeqgSkKjz",
      // Use `timestamp` for historical data import
      timestamp: "2021-07-21T01:43:55Z",
      // Recommended: use an idempotency key to make sure your events are unique
      // and your event pipeline is resilient to failures
      messageId: "kfzKyjdURh",
      // `sentAt` isn't required
      sentAt: new Date().toUTCString(),
    },
    {
      type: "track",
      properties: {
        experiment_id: "Sp0n1Q2ziJ",
        experiment_name: "button_alteration",
        variation_id: "B4Atsa9ahA",
        variation_name: "blue",
      },
      event: "Experiment Viewed",
      userId: "1cezxfHlqZ",
      timestamp: "2021-07-21T01:43:55Z",
      // Recommended: use an idempotency key to make sure your events are unique
      // and your event pipeline is resilient to failures
      messageId: "rQeUO6L9yV",
    },
  ],
};

// 3. Perform request with `Authorization: Basic [token]` in the header
fetch("http://localhost:3000/event/batch", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Basic ${token}`,
  },
  body: JSON.stringify(data),
})
  .then((res) => res.json())
  .then((result) => console.log(result));
