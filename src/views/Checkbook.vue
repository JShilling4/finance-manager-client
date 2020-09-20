<template>
  <div class="checkbook">
    <div class="transactionTable">
      <div class="transactionTable_header">
        <div class="transactionTable__dateSelection">
          <v-menu
            v-model="tableMonthPickerShowing"
            :nudge-right="40"
            transition="scale-transition"
            offset-y
            max-width="290px"
            min-width="290px"
          >
            <template v-slot:activator="{ on }">
              <span v-on="on">{{ tableMonthDisplay }}</span>
            </template>
            <v-date-picker
              v-model="tableMonth"
              type="month"
              color="#9072ea"
              no-title
              @input="tableMonthPickerShowing = false"
              @change="filterTransactions"
            />
          </v-menu>
        </div>
        <v-icon
          class="mr-2"
          color="white"
          @click.stop="initializeTransactionModal('add')"
        >
          mdi-plus-circle
        </v-icon>
      </div>

      <!-- Transaction Table -->
      <v-card>
        <v-card-title>
          <v-text-field
            v-model="tableSearchString"
            append-icon="mdi-magnify"
            label="Search"
            color="#9072ea"
            single-line
            hide-details
          ></v-text-field>
        </v-card-title>
        <v-data-table
          :headers="tableHeaders"
          :items="filteredTransactions"
          :search="tableSearchString"
        >
          <template v-slot:[`item.cleared`]="{ item }">
            <v-icon :color="item.cleared ? 'green' : 'grey lighten-2'">
              mdi-clipboard-check
            </v-icon>
          </template>

          <template v-slot:[`item.clearedDatetime`]="{ item }">
            {{ formatDatetime(item.clearedDatetime) }}
          </template>

          <template v-slot:[`item.amount`]="{ item }">
            <span :style="item.amount < 0 ? 'color: red;' : 'color: green;'"
              >${{ item.amount | formatNumber }}</span
            >
          </template>

          <template v-slot:[`item.clearedAccountBalance`]="{ item }">
            ${{ item.clearedAccountBalance | formatNumber }}
          </template>

          <template v-slot:[`item.actions`]="{ item }">
            <v-icon
              class="mr-4"
              @click="initializeTransactionModal('edit', item)"
            >
              mdi-file-edit
            </v-icon>
            <v-icon @click="onDeleteTransaction(item)">
              mdi-delete
            </v-icon>
          </template>
        </v-data-table>
      </v-card>
    </div>
    <!-- Transaction Modal -->
    <v-dialog v-model="transactionModalShowing" width="500">
      <v-card class="px-8 pt-2">
        <h2 class="headline text-center mb-2">Add Transaction</h2>
        <!-- Header controls -->
        <v-row justify="center" class="mb-4">
          <div>
            <v-btn-toggle
              v-model="localTransaction.type"
              color="#9072ea"
              mandatory
            >
              <v-btn :x-small="true" :outlined="true" value="debit"
                >Expense</v-btn
              >
              <v-btn :x-small="true" :outlined="true" value="credit"
                >Income</v-btn
              >
              <v-btn :x-small="true" :outlined="true" value="transfer"
                >Transfer</v-btn
              >
            </v-btn-toggle>
          </div>
        </v-row>
        <v-form
          ref="transactionForm"
          v-model="transactionIsValid"
          :lazy-validation="true"
        >
          <!-- Category -->
          <v-autocomplete
            label="Category"
            :items="categories.categories"
            item-text="name"
            color="#9072ea"
            v-model="localTransaction.category"
            :rules="[(v) => !!v || 'Category is required']"
            required
            return-object
          ></v-autocomplete>

          <!-- Account -->
          <v-select
            label="Account"
            :items="accounts.accounts"
            item-text="name"
            color="#9072ea"
            v-model="localTransaction.account"
            :rules="[(v) => !!v || 'Account is required']"
            required
            return-object
          />

          <!-- Amount -->
          <v-text-field
            height="24px"
            label="Amount"
            color="#9072ea"
            v-model="formattedAmount"
            :rules="[(v) => !!v || 'Amount is required']"
            required
          />

          <!-- Cleared Datetime -->
          <v-menu
            v-model="clearedDatetimeMenuShowing"
            :close-on-content-click="false"
            :nudge-right="40"
            transition="scale-transition"
            offset-y
            max-width="290px"
            min-width="290px"
          >
            <template v-slot:activator="{ on }">
              <v-text-field
                label="Date"
                readonly
                color="#9072ea"
                :value="formattedDatetime"
                v-on="on"
              />
            </template>
            <v-date-picker
              v-model="clearedDatetime"
              no-title
              color="#9072ea"
              @input="clearedDatetimeMenuShowing = false"
            />
          </v-menu>

          <!-- Payee -->
          <v-autocomplete
            label="Payee"
            :items="payees.payees"
            item-text="name"
            color="#9072ea"
            :search-input.sync="payeeSearchString"
            v-model="localTransaction.payee"
            return-object
          ></v-autocomplete>

          <!-- Cleared -->
          <div class="mb-6 mt-2">
            Cleared
            <v-btn
              icon
              @click="localTransaction.cleared = !localTransaction.cleared"
              :color="clearedIconColor"
            >
              <v-icon>mdi-clipboard-check</v-icon>
            </v-btn>
          </div>

          <!-- Description -->
          <v-textarea
            label="Description"
            :no-resize="true"
            :outlined="true"
            color="#9072ea"
            :rows="3"
            v-model="localTransaction.description"
          />

          <!-- Footer controls -->
          <v-card-actions class="pb-4">
            <v-spacer></v-spacer>
            <v-btn
              width="140px"
              color="#9072ea"
              :outlined="true"
              @click="postTransaction"
            >
              Save
            </v-btn>
            <v-btn
              width="140px"
              color="#000"
              :outlined="true"
              @click="closeTransactionModal"
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
// dependencies
import { mapActions, mapState } from "vuex";
import moment from "moment";
// components

export default {
  name: "Checkbook",
  data() {
    return {
      defaultTransaction: {
        account: null,
        amount: null,
        category: null,
        cleared: false,
        clearedAccountBalance: null,
        clearedDatetime: null,
        id: null,
        payee: null,
        type: "debit",
      },
      tableHeaders: [
        { text: "Cleared", value: "cleared" },
        { text: "Category", value: "category.name" },
        { text: "Date", value: "clearedDatetime" },
        { text: "Amount", value: "amount" },
        { text: "Balance", value: "clearedAccountBalance" },
        { text: "Actions", value: "actions", sortable: false },
      ],
      filteredTransactions: [],
      localTransaction: {},
      tableMonth: moment().toISOString(),
      clearedDatetimeMenuShowing: false,
      tableMonthPickerShowing: false,
      transactionIsValid: true,
      transactionModalShowing: false,
      tableSearchString: null,
      payeeSearchString: null,
    };
  },
  computed: {
    ...mapState(["accounts", "transactions", "categories", "payees"]),
    formattedDatetime() {
      const { clearedDatetime } = this.localTransaction;
      if (clearedDatetime !== null) {
        return moment(clearedDatetime)
          .format("MM-DD-YY")
          .toString();
      }
      return moment().format("MM-DD-YY");
    },
    formattedAmount: {
      get() {
        return Math.abs(this.localTransaction.amount);
      },
      set(value) {
        this.localTransaction.amount = value;
      },
    },
    clearedIconColor() {
      return this.localTransaction.cleared ? "green" : "grey lighten-1";
    },
    tableMonthDisplay() {
      return moment(this.tableMonth).format("MMMM YYYY");
    },
    allTransactions() {
      return this.transactions.transactions;
    },
    clearedDatetime: {
      get() {
        return this.localTransaction.clearedDatetime;
      },
      set(value) {
        const format = "YYYY-MM-DD HH:mm:ss";
        const holder = moment(value).format(
          "YYYY-MM-DD" + " " + moment().format("HH:mm:ss")
        );
        this.localTransaction.clearedDatetime = moment(holder).format();
      },
    },
  },
  watch: {
    allTransactions() {
      this.filterTransactions();
    },
  },
  methods: {
    ...mapActions([
      "fetchAccounts",
      "fetchTransactions",
      "fetchCategories",
      "fetchPayees",
      "saveTransaction",
      "deleteTransaction",
      "cloneObject",
      "cloneArray",
    ]),
    checkMonthAndYear(first, second) {
      return (
        moment(first).format("YY") === moment(second).format("YY") &&
        moment(first).format("MM") === moment(second).format("MM")
      );
    },
    async closeTransactionModal() {
      this.localTransaction = await this.cloneObject(this.defaultTransaction);
      // this.resetTransactionForm();
      this.transactionModalShowing = false;
    },
    async onDeleteTransaction(transaction) {
      this.deleteTransaction(transaction);
    },
    async filterTransactions() {
      this.filteredTransactions = await this.cloneArray(this.allTransactions);
      this.filteredTransactions = this.filteredTransactions.filter((tr) =>
        this.checkMonthAndYear(tr.clearedDatetime, this.tableMonth)
      );
      this.filteredTransactions = this.filteredTransactions.sort(
        (a, b) => new Date(b.clearedDatetime) - new Date(a.clearedDatetime)
      );
    },
    formatDatetime(datetime) {
      return moment(datetime).format("MM-DD-YY");
    },
    async initializeTransactionModal(action, transaction = null) {
      if (action == "add") {
        this.localTransaction = await this.cloneObject(this.defaultTransaction);
        this.localTransaction.clearedDatetime = moment().format();
        this.transactionModalShowing = true;
      }
      if (action == "edit") {
        this.localTransaction = await this.cloneObject(transaction);
        this.transactionModalShowing = true;
      }
      this.resetValidity();
    },
    resetValidity() {
      if (this.$refs.transactionForm) {
        this.$refs.transactionForm.resetValidation();
      }
    },
    async postTransaction() {
      const formIsValid = await this.$refs.transactionForm.validate();
      if (formIsValid) {
        const { clearedDatetime } = this.localTransaction;
        this.saveTransaction(this.localTransaction);
        this.closeTransactionModal();
        this.filterTransactions();
      }
    },
  },
  async created() {
    this.fetchAccounts();
    this.fetchCategories();
    this.fetchPayees();
    await this.fetchTransactions();
    this.filterTransactions();
  },
};
</script>

<style lang="scss" scoped>
.checkbook {
  margin-left: 17rem;
}
// TABLE MANAGER
.transactionTable {
  color: white;
  margin: 0 auto;
  padding: 2rem 2rem;

  &__dateSelection {
    flex-grow: 1;
    text-align: center;
    span {
      cursor: pointer;
    }
  }

  &_header {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 2rem;
    background-color: $app-purple;

    .fa-plus {
      padding-right: 1rem;
    }
  }
}

li {
  color: #333333;
  padding: 0 1rem;
}
</style>
