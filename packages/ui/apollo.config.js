module.exports = {
  client: {
    service: {
      name: "api",
      url: "http://localhost:3000/graphql",
      headers: {
        // TODO: This authorization header is only accepted if the NODE_ENV is development
        authorization: "INTROSPECTION",
      },
      // optional disable SSL validation check
      skipSSLValidation: true,
    },
  },
};
