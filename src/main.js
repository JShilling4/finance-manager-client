import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import apolloProvider from "./graphql";
import vuetify from "./plugins/vuetify";

Vue.config.productionTip = false;

Vue.filter("formatNumber", (value) => {
  return parseFloat(value).toFixed(2);
});

new Vue({
  router,
  store,
  apolloProvider,
  vuetify,
  render: (h) => h(App),
}).$mount("#app");
