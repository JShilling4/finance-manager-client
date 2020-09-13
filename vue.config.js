module.exports = {
  css: {
    loaderOptions: {
      scss: {
        prependData: `
          @import "~@/scss/variables.scss";
          @import "~@/scss/mixins.scss";
          @import "~@/scss/animations.scss";
        `,
        sourceMap: true,
      },
    },
    sourceMap: true,
  },

  configureWebpack: {
    devtool: "#source-map",
  },
  transpileDependencies: ["vuetify"],
  chainWebpack: (config) => {
    // GraphQL Loader
    config.module
      .rule("graphql")
      .test(/\.(graphql|gql)$/)
      .use("graphql-tag/loader")
      .loader("graphql-tag/loader")
      .end();
  },
};
