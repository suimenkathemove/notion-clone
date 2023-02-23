module.exports = {
  client: {
    service: {
      name: "slack-clone-frontend",
      url: "http://localhost:8080",
    },
    includes: ["./src/**/*.graphql.ts"],
  },
};
