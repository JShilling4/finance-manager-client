module.exports = {
  client: {
    service: {
      name: "finance-manager",
      // URL to the GraphQL API
      url:
        process.env.NODE_ENV === "development"
          ? "http://localhost:4000/graphql"
          : "https://sw-finance-manager.herokuapp.com/graphql",
    },
    // Files processed by the extension
    includes: ["src/**/*.vue", "src/**/*.js"],
  },
};
