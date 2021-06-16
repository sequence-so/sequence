// module.exports = {
//   client: {
//     includes: ["src/**/*.{ts,tsx,js,jsx,graphql}"],
//     localSchemaFile: "./schema.json",
//   },
//   service: {
//     endpoint: {
//       url: "http://localhost:3000/graphql",
//       headers: {
//         authorization:
//           ,
//       },
//     },
//   },
// };

module.exports = {
  client: {
    service: {
      name: "api",
      url: "http://localhost:3000/graphql",
      // optional headers
      headers: {
        authorization:
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiZDcxZjk1YTUtNzNiZi00YmVhLTg2YjEtMDhjM2MyZGIxODU4IiwiZW1haWwiOiJoZWxzb250QGdtYWlsLmNvbSIsImZpcnN0TmFtZSI6IkhlbHNvbiIsImxhc3ROYW1lIjoiVGF2ZXJhcyIsIm9uYm9hcmRlZEF0IjoiMjAyMS0wNi0wOFQyMDowNTozNC45NzlaIn0sImlhdCI6MTYyMzg2NjQ1MywiZXhwIjoxNjI0MTI1NjUzLCJhdWQiOiJodHRwOi8vbG9jYWxob3N0OjMwMDAiLCJpc3MiOiJzZXF1ZW5jZS5zbyJ9.CAkgyUEpyBNx4-UwQZL6zPvW3Y-NFBYx1AQsZRA4PrQ",
      },
      // optional disable SSL validation check
      skipSSLValidation: true,
    },
  },
};
