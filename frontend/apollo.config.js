module.exports = {
  client: {
    service: {
      name: "monorepo-sandbox-frontend",
      url: "http://localhost:8080",
    },
    includes: ["./src/**/*.graphql.ts"],
  },
};
