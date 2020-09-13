<template>
  <div class="accountManagement">
    <h2>Account Management</h2>

    <div class="tableHeader">
      <v-icon
        class="mr-2"
        color="white"
        @click.stop="initializeAccountModal('add')"
      >
        mdi-plus-circle
      </v-icon>
    </div>
    <!-- Accounts Table -->
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
        :items="accounts.accounts"
        :search="tableSearchString"
      >
        <template v-slot:[`item.balance`]="{ item }">
          ${{ item.balance | formatNumber }}
        </template>

        <template v-slot:[`item.actions`]="{ item }">
          <v-icon class="mr-6" @click="initializeAccountModal('edit', item)">
            mdi-file-edit
          </v-icon>
          <v-icon @click="onDeleteAccount(item)">
            mdi-delete
          </v-icon>
        </template>
      </v-data-table>
    </v-card>

    <!-- Account Modal -->
    <v-dialog v-model="accountModalShowing" width="500">
      <v-card class="px-8 pt-2">
        <h2 class="headline text-center mb-2">
          {{ this.action == "edit" ? "Edit" : "Add" }} Account
        </h2>

        <v-form
          ref="accountForm"
          v-model="accountIsValid"
          :lazy-validation="true"
        >
          <!-- Name -->
          <v-text-field
            height="24px"
            label="Name"
            v-model="localAccount.name"
            :rules="[(v) => !!v || 'Name is required']"
            required
          />

          <!-- Balance -->
          <v-text-field
            v-if="action === 'add'"
            height="24px"
            label="Balance"
            v-model="localAccount.balance"
            :rules="[(v) => !!v || 'Amount is required']"
            required
          />

          <!-- Footer controls -->
          <v-card-actions class="pb-4">
            <v-spacer></v-spacer>
            <v-btn width="140px" color="error" @click="closeAccountModal">
              Cancel
            </v-btn>
            <v-btn width="140px" color="success" @click="postAccount">
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
  name: "AccountManagement",
  data() {
    return {
      tableHeaders: [
        { text: "Name", value: "name" },
        { text: "Balance", value: "balance" },
        { text: "Actions", value: "actions", sortable: false },
      ],
      tableSearchString: null,
      accountModalShowing: false,
      defaultAccount: {
        name: null,
        balance: null,
      },
      localAccount: {},
      action: null,
      accountIsValid: true,
    };
  },
  computed: {
    ...mapState(["accounts"]),
  },
  methods: {
    ...mapActions([
      "fetchAccounts",
      "cloneObject",
      "saveAccount",
      "deleteAccount",
    ]),
    async initializeAccountModal(action, account = null) {
      this.action = action;
      if (action == "add") {
        this.localAccount = await this.cloneObject(this.defaultAccount);
        this.accountModalShowing = true;
      }
      if (action == "edit") {
        this.localAccount = await this.cloneObject(account);
        this.accountModalShowing = true;
      }
      this.resetValidity();
    },
    closeAccountModal() {
      this.localAccount = this.cloneObject(this.defaultAccount);
      this.accountModalShowing = false;
    },
    async postAccount() {
      const formIsValid = await this.$refs.accountForm.validate();
      if (formIsValid) {
        this.saveAccount(this.localAccount);
        this.accountModalShowing = false;
      }
    },
    onDeleteAccount(account) {
      this.deleteAccount(account);
    },
    resetValidity() {
      if (this.$refs.accountForm) {
        this.$refs.accountForm.resetValidation();
      }
    },
  },
  created() {
    this.fetchAccounts();
  },
};
</script>

<style lang="scss" scoped>
.accountManagement {
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
