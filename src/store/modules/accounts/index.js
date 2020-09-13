import { apolloClient } from "@/graphql";
import getAllAccounts from "@/graphql/accounts/getAllAccounts.gql";
import postAccount from "@/graphql/accounts/postAccount.gql";
import deleteAccount from "@/graphql/accounts/deleteAccount.gql";

export default {
  state: {
    accounts: [],
  },

  mutations: {
    UPDATE_ACCOUNTS(state, accounts) {
      state.accounts = accounts;
    },
    CREATE_ACCOUNT(state, account) {
      state.accounts.push(account);
    },
    EDIT_ACCOUNT(state, data) {
      const { index, account } = data;
      state.accounts.splice(index, 1, account);
    },
    DELETE_ACCOUNT(state, index) {
      state.accounts.splice(index, 1);
    },
  },

  actions: {
    fetchAccounts: async ({ commit }) => {
      const { data } = await apolloClient.query({ query: getAllAccounts });
      commit("UPDATE_ACCOUNTS", data.getAllAccounts);
    },
    saveAccount: async ({ state, commit }, account) => {
      try {
        const { data } = await apolloClient.mutate({
          mutation: postAccount,
          variables: {
            id: account.id,
            name: account.name,
            balance: parseFloat(account.balance),
          },
        });
        const { id } = data.postAccount;
        const index = state.accounts.findIndex((cat) => cat.id == id);
        if (index == -1) {
          commit("CREATE_ACCOUNT", data.postAccount);
        } else {
          commit("EDIT_ACCOUNT", {
            index,
            account: data.postAccount,
          });
        }
      } catch (e) {
        console.log(e);
      }
    },
    deleteAccount: async ({ state, commit }, account) => {
      try {
        await apolloClient.mutate({
          mutation: deleteAccount,
          variables: {
            id: Number(account.id),
          },
        });
        const index = state.accounts.findIndex((cat) => cat.id == account.id);
        commit("DELETE_ACCOUNT", index);
      } catch (e) {
        return e;
      }
    },
  },
};
