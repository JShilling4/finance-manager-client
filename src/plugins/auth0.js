import Vue from "vue";
import router from "../router";
import { Auth0Plugin } from "../auth/authWrapper";

const domain =
  process.env.NODE_ENV == "development"
    ? "dev-p97jtvjf.us.auth0.com"
    : "prod-p97jtvjf.us.auth0.com";

const clientId =
  process.env.NODE_ENV == "development"
    ? "X2VRKYB7gfxivS402x8klJBpdKaVIRqZ"
    : "VptEVxxPnKNRcfFv8S8Os6XL9C16bMlA";

Vue.use(Auth0Plugin, {
  domain,
  clientId,
  onRedirectCallback: (appState) => {
    router.push(
      appState && appState.targetUrl
        ? appState.targetUrl
        : window.location.pathname
    );
  },
});

export default Auth0Plugin;
