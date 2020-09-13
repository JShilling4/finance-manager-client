import { apolloClient } from "@/graphql";
import getAllCategories from "@/graphql/categories/getAllCategories.gql";
import postCategory from "@/graphql/categories/postCategory.gql";
import deleteCategory from "@/graphql/categories/deleteCategory.gql";

export default {
  state: {
    categories: [],
  },

  mutations: {
    UPDATE_CATEGORIES(state, categories) {
      state.categories = categories;
    },
    CREATE_CATEGORY(state, category) {
      state.categories.push(category);
    },
    EDIT_CATEGORY(state, data) {
      const { index, category } = data;
      state.categories.splice(index, 1, category);
    },
    DELETE_CATEGORY(state, index) {
      state.categories.splice(index, 1);
    },
  },

  actions: {
    fetchCategories: async ({ commit }) => {
      const { data } = await apolloClient.query({ query: getAllCategories });
      commit("UPDATE_CATEGORIES", data.getAllCategories);
    },
    saveCategory: async ({ state, commit }, category) => {
      try {
        const { data } = await apolloClient.mutate({
          mutation: postCategory,
          variables: {
            id: category.id,
            name: category.name,
          },
        });
        const { id } = data.postCategory;
        const index = state.categories.findIndex((cat) => cat.id == id);
        if (index == -1) {
          commit("CREATE_CATEGORY", data.postCategory);
        } else {
          commit("EDIT_CATEGORY", {
            index,
            category: data.postCategory,
          });
        }
      } catch (e) {
        console.log(e);
      }
    },
    deleteCategory: async ({ state, commit }, category) => {
      try {
        await apolloClient.mutate({
          mutation: deleteCategory,
          variables: {
            id: Number(category.id),
          },
        });
        const index = state.categories.findIndex(
          (cat) => cat.id == category.id
        );
        commit("DELETE_CATEGORY", index);
      } catch (e) {
        return e;
      }
    },
  },
};
