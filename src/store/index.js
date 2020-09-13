import Vue from "vue";
import Vuex from "vuex";

import accounts from "./modules/accounts";
import transactions from "./modules/transactions";
import categories from "./modules/categories";
import payees from "./modules/payees";

Vue.use(Vuex);

export default new Vuex.Store({
  strict: process.env.NODE_ENV !== "production",
  state: {},
  mutations: {},
  actions: {
    cloneObject: ({ context }, object) => {
      return JSON.parse(JSON.stringify({ ...object }));
    },
    cloneArray: ({ context }, array) => {
      return JSON.parse(JSON.stringify([...array]));
    },
  },
  modules: {
    accounts,
    transactions,
    categories,
    payees,
  },
});
