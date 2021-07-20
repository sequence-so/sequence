import fetch from "node-fetch";

// 1. Get token from https://my.sequence.so/onboarding/node-sdk
const basicUsername = "5a237edc72586ce9e47d55dcb31b0ae180c0";

// 2. Base64 encode the Username:Password (password is empty)
const token = Buffer.from(basicUsername + ":").toString("base64");

const data = {
  firstName: "Wei",
  lastName: "James",
  email: "pifagor@example.me",
  plan: "premium",
  logins: 5,
  myCustomAttribute: "testing",
  externalId: "kfzKyjdURh",
};

// 3. Perform request with `Authorization: Basic [token]` in the header
fetch("http://localhost:3000/user", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Basic ${token}`,
  },
  body: JSON.stringify(data),
})
  .then((res) => res.json())
  .then((result) => console.log(result));
