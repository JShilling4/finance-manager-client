import { apolloClient } from "@/graphql";
import getAllTransactions from "@/graphql/transactions/getAllTransactions.gql";
import postTransaction from "@/graphql/transactions/postTransaction.gql";
import deleteTransaction from "@/graphql/transactions/deleteTransaction.gql";

export default {
  state: {
    transactions: [],
  },

  mutations: {
    UPDATE_TRANSACTIONS(state, transactions) {
      state.transactions = transactions;
    },
    CREATE_TRANSACTION(state, transaction) {
      state.transactions.push(transaction);
    },
    EDIT_TRANSACTION(state, data) {
      const { index, transaction } = data;
      state.transactions.splice(index, 1, transaction);
    },
    DELETE_TRANSACTION(state, index) {
      state.transactions.splice(index, 1);
    },
  },

  actions: {
    fetchTransactions: async ({ commit }) => {
      const { data } = await apolloClient.query({ query: getAllTransactions });
      commit("UPDATE_TRANSACTIONS", data.getAllTransactions);
    },
    saveTransaction: async (
      { state, rootState, dispatch, commit },
      transaction
    ) => {
      try {
        const { data } = await apolloClient.mutate({
          mutation: postTransaction,
          variables: {
            id: transaction.id !== null ? Number(transaction.id) : null,
            accountId: Number(transaction.account.id),
            categoryId: Number(transaction.category.id),
            payeeId:
              transaction.payee !== null ? Number(transaction.payee.id) : null,
            type: transaction.type,
            cleared: transaction.cleared,
            clearedDatetime: transaction.clearedDatetime,
            amount: parseFloat(transaction.amount),
            description: transaction.description,
          },
        });
        const { id } = data.postTransaction;
        const index = state.transactions.findIndex((tr) => tr.id == id);
        if (index == -1) {
          commit("CREATE_TRANSACTION", data.postTransaction);
        } else {
          commit("EDIT_TRANSACTION", {
            index,
            transaction: data.postTransaction,
          });
        }
        const accountIndex = rootState.accounts.accounts.findIndex(
          (acc) => acc.id == data.postTransaction.account.id
        );
        commit("EDIT_ACCOUNT", {
          index: accountIndex,
          account: data.postTransaction.account,
        });
        dispatch("fetchTransactions");
      } catch (e) {
        console.log(e);
      }
    },
    deleteTransaction: async (
      { state, rootState, dispatch, commit },
      transaction
    ) => {
      try {
        const { data } = await apolloClient.mutate({
          mutation: deleteTransaction,
          variables: {
            id: Number(transaction.id),
            accountId: Number(transaction.account.id),
            categoryId: Number(transaction.category.id),
            payeeId:
              transaction.payee !== null ? Number(transaction.payee.id) : null,
            type: transaction.type,
            cleared: transaction.cleared,
            clearedDatetime: transaction.clearedDatetime,
            amount: parseFloat(transaction.amount),
            description: transaction.description,
          },
        });
        const index = state.transactions.findIndex(
          (tr) => tr.id == transaction.id
        );
        commit("DELETE_TRANSACTION", index);
        const accountIndex = rootState.accounts.accounts.findIndex(
          (acc) => acc.id == data.deleteTransaction.id
        );
        commit("EDIT_ACCOUNT", {
          index: accountIndex,
          account: data.deleteTransaction,
        });
        dispatch("fetchTransactions");
      } catch (e) {
        return e;
      }
    },
  },
};
