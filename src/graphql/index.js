import Vue from "vue";
import VueApollo from "vue-apollo";
import { ApolloClient } from "apollo-client";
import { HttpLink } from "apollo-link-http";
import { InMemoryCache } from "apollo-cache-inmemory";

// HTTP connection to the API
const httpLink = new HttpLink({
  uri:
    process.env.NODE_ENV === "development"
      ? "http://localhost:4000/graphql"
      : "https://sw-finance-manager.herokuapp.com/graphql",
});
const httpLink = new HttpLink({
  // You should use an absolute URL here

  uri: "",
});

const defaultOptions = {
  watchQuery: {
    fetchPolicy: "no-cache",
  },
  query: {
    fetchPolicy: "no-cache",
  },
};
// Create the apollo client
export const apolloClient = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache({
    addTypename: false,
  }),
  defaultOptions: defaultOptions,
  connectToDevTools: true,
});

const apolloProvider = new VueApollo({
  defaultClient: apolloClient,
});

// Install the vue plugin
Vue.use(VueApollo);

export default apolloProvider;
