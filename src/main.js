import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import apolloProvider from "./graphql";
import vuetify from "./plugins/vuetify";
import Auth0Plugin from "./plugins/auth0";

Vue.config.productionTip = false;

Vue.filter("formatNumber", (value) => {
  return parseFloat(value).toFixed(2);
});

new Vue({
  router,
  store,
  apolloProvider,
  vuetify,
  Auth0Plugin,
  render: (h) => h(App),
}).$mount("#app");
