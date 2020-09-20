import Vue from "vue";
import router from "../router";
import { domain, clientId } from "../../auth_config.json";
import { Auth0Plugin } from "../auth/authWrapper";

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
