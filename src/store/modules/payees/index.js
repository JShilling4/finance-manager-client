import { apolloClient } from "@/graphql";
import getAllPayees from "@/graphql/payees/getAllPayees.gql";
import postPayee from "@/graphql/payees/postPayee.gql";
import deletePayee from "@/graphql/payees/deletePayee.gql";

export default {
  state: {
    payees: [],
  },

  mutations: {
    UPDATE_PAYEES(state, payees) {
      state.payees = payees;
    },
    CREATE_PAYEE(state, payee) {
      state.payees.push(payee);
    },
    EDIT_PAYEE(state, data) {
      const { index, payee } = data;
      state.payees.splice(index, 1, payee);
    },
    DELETE_PAYEE(state, index) {
      state.payees.splice(index, 1);
    },
  },

  actions: {
    fetchPayees: async ({ commit }) => {
      const { data } = await apolloClient.query({ query: getAllPayees });
      commit("UPDATE_PAYEES", data.getAllPayees);
    },
    savePayee: async ({ state, commit }, payee) => {
      try {
        const { data } = await apolloClient.mutate({
          mutation: postPayee,
          variables: {
            id: payee.id,
            name: payee.name,
          },
        });
        const { id } = data.postPayee;
        const index = state.payees.findIndex((payee) => payee.id == id);
        if (index == -1) {
          commit("CREATE_PAYEE", data.postPayee);
        } else {
          commit("EDIT_PAYEE", {
            index,
            payee: data.postPayee,
          });
        }
      } catch (e) {
        console.log(e);
      }
    },
    deletePayee: async ({ state, commit }, payee) => {
      try {
        await apolloClient.mutate({
          mutation: deletePayee,
          variables: {
            id: Number(payee.id),
          },
        });
        const index = state.payees.findIndex((p) => p.id == payee.id);
        commit("DELETE_PAYEE", index);
      } catch (e) {
        return e;
      }
    },
  },
};
