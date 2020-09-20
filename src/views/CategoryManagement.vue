<template>
  <div class="categoryManagement">
    <h2>Category Management</h2>

    <div class="tableHeader">
      <v-icon
        class="mr-2"
        color="white"
        @click.stop="initializeCategoryModal('add')"
      >
        mdi-plus-circle
      </v-icon>
    </div>
    <!-- Category Table -->
    <v-card>
      <v-card-title>
        <v-text-field
          v-model="tableSearchString"
          append-icon="mdi-magnify"
          label="Search"
          single-line
          hide-details
        ></v-text-field>
      </v-card-title>
      <v-data-table
        :headers="tableHeaders"
        :items="categories.categories"
        :search="tableSearchString"
      >
        <template v-slot:[`item.actions`]="{ item }">
          <v-icon class="mr-6" @click="initializeCategoryModal('edit', item)">
            mdi-file-edit
          </v-icon>
          <v-icon @click="onDeleteCategory(item)">
            mdi-delete
          </v-icon>
        </template>
      </v-data-table>
    </v-card>

    <!-- Category Modal -->
    <v-dialog v-model="categoryModalShowing" width="500">
      <v-card class="px-8 pt-2">
        <h2 class="headline text-center mb-2">
          {{ this.action == "edit" ? "Edit" : "Add" }} Category
        </h2>

        <v-form
          ref="categoryForm"
          v-model="categoryIsValid"
          :lazy-validation="true"
        >
          <!-- Name -->
          <v-text-field
            height="24px"
            label="Name"
            color="#9072ea"
            v-model="localCategory.name"
            :rules="[(v) => !!v || 'Name is required']"
            required
          />
          <!-- Footer controls -->
          <v-card-actions class="pb-4">
            <v-spacer></v-spacer>
            <v-btn
              width="140px"
              color="#9072ea"
              :outlined="true"
              @click="postCategory"
            >
              Save
            </v-btn>
            <v-btn
              width="140px"
              color="#000"
              :outlined="true"
              @click="closeCategoryModal"
            >
              Cancel
            </v-btn>
          </v-card-actions>
        </v-form>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";

export default {
  name: "CategoryManagement",
  data() {
    return {
      tableHeaders: [
        { text: "Name", value: "name" },
        { text: "Actions", value: "actions", sortable: false },
      ],
      tableSearchString: null,
      categoryModalShowing: false,
      localCategory: {},
      defaultCategory: {
        id: null,
        name: null,
      },
      categoryIsValid: true,
      action: null,
    };
  },
  computed: {
    ...mapState(["categories"]),
  },
  methods: {
    ...mapActions([
      "fetchCategories",
      "cloneObject",
      "saveCategory",
      "deleteCategory",
    ]),
    async initializeCategoryModal(action, category = null) {
      this.action = action;
      if (action == "add") {
        this.localCategory = this.cloneObject(this.defaultCategory);
        this.categoryModalShowing = true;
      }
      if (action == "edit") {
        this.localCategory = await this.cloneObject(category);
        this.categoryModalShowing = true;
      }
      this.resetValidity();
    },
    closeCategoryModal() {
      this.categoryModalShowing = false;
    },
    async postCategory() {
      const formIsValid = await this.$refs.categoryForm.validate();
      if (formIsValid) {
        this.saveCategory(this.localCategory);
        this.categoryModalShowing = false;
      }
    },
    onDeleteCategory(category) {
      this.deleteCategory(category);
    },
    resetValidity() {
      if (this.$refs.categoryForm) {
        this.$refs.categoryForm.resetValidation();
      }
    },
  },
  created() {
    this.fetchCategories();
  },
};
</script>

<style lang="scss" scoped>
.categoryManagement {
  margin-left: 20rem;
  padding: 2rem;
  h2 {
    margin-bottom: 2rem;
  }
}
.tableHeader {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  height: 2rem;
  background-color: $app-purple;

  .fa-plus {
    padding-right: 1rem;
  }
}
</style>
