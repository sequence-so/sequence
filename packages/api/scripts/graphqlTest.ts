import fetch from "node-fetch";
// 1. Get token from https://my.sequence.so/onboarding/node-sdk
const basicUsername = "99e7940608129928d024cb04a7fed7868e13";

// 2. Base64 encode the Username:Password (password is empty)
const token = Buffer.from(basicUsername + ":").toString("base64");

// 3. Add your token to `Authorization` in the header
fetch("https://api.sequence.so/graphql", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Basic ${token}`,
  },
  body: JSON.stringify({
    query: `
        query GetUser {
          getUser {
            id
            firstName
            lastName
            email
          }
        }
      `,
    variables: {
      // put variables here if you need them
    },
  }),
})
  .then((res) => res.json())
  .then((result) => console.log(result));
