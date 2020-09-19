<template>
  <div class="payeeManagement">
    <h2>Payee Management</h2>

    <div class="tableHeader">
      <v-icon
        class="mr-2"
        color="white"
        @click.stop="initializePayeeModal('add')"
      >
        mdi-plus-circle
      </v-icon>
    </div>
    <!-- Payee Table -->
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
        :items="payees.payees"
        :search="tableSearchString"
      >
        <template v-slot:[`item.actions`]="{ item }">
          <v-icon class="mr-6" @click="initializePayeeModal('edit', item)">
            mdi-file-edit
          </v-icon>
          <v-icon @click="onDeletePayee(item)">
            mdi-delete
          </v-icon>
        </template>
      </v-data-table>
    </v-card>

    <!-- Payee Modal -->
    <v-dialog v-model="payeeModalShowing" width="500">
      <v-card class="px-8 pt-2">
        <h2 class="headline text-center mb-2">
          {{ this.action == "edit" ? "Edit" : "Add" }} Payee
        </h2>

        <v-form ref="payeeForm" v-model="payeeIsValid" :lazy-validation="true">
          <!-- Name -->
          <v-text-field
            height="24px"
            label="Name"
            color="#9072ea"
            v-model="localPayee.name"
            :rules="[(v) => !!v || 'Name is required']"
            required
          />
          <!-- Footer controls -->
          <v-card-actions class="pb-4">
            <v-spacer></v-spacer>
            <v-btn width="140px" color="error" @click="closePayeeModal">
              Cancel
            </v-btn>
            <v-btn width="140px" color="success" @click="postPayee">
              Save
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
  name: "PayeeManagement",
  data() {
    return {
      tableHeaders: [
        { text: "Name", value: "name" },
        { text: "Actions", value: "actions", sortable: false },
      ],
      tableSearchString: null,
      payeeModalShowing: false,
      localPayee: {},
      defaultPayee: {
        id: null,
        name: null,
      },
      payeeIsValid: true,
      action: null,
    };
  },
  computed: {
    ...mapState(["payees"]),
  },
  methods: {
    ...mapActions(["fetchPayees", "cloneObject", "savePayee", "deletePayee"]),
    async initializePayeeModal(action, payee = null) {
      this.action = action;
      if (action == "add") {
        this.localPayee = this.cloneObject(this.defaultPayee);
        this.payeeModalShowing = true;
      }
      if (action == "edit") {
        this.localPayee = await this.cloneObject(payee);
        this.payeeModalShowing = true;
      }
      this.resetValidity();
    },
    closePayeeModal() {
      this.localPayee = this.cloneObject(this.defaultPayee);
      this.payeeModalShowing = false;
    },
    async postPayee() {
      const formIsValid = await this.$refs.payeeForm.validate();
      if (formIsValid) {
        this.savePayee(this.localPayee);
        this.payeeModalShowing = false;
      }
    },
    onDeletePayee(payee) {
      this.deletePayee(payee);
    },
    resetValidity() {
      if (this.$refs.payeeForm) {
        this.$refs.payeeForm.resetValidation();
      }
    },
  },
  created() {
    this.fetchPayees();
  },
};
</script>

<style lang="scss" scoped>
.payeeManagement {
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
