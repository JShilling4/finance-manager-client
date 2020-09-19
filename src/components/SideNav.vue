<template>
  <div class="sideNav-list">
    <AccountList :accounts="accounts.accounts" />
    <div class="navLink-container">
      <router-link to="/account-management" class="navLink">
        Account Management
      </router-link>
      <router-link to="/category-management" class="navLink">
        Category Management
      </router-link>
      <router-link to="/payee-management" class="navLink">
        Payee Management
      </router-link>
    </div>
  </div>
</template>

<script>
// dependencies
import { mapState, mapActions } from "vuex";
//components
import AccountList from "@/components/AccountList";

export default {
  name: "SideNav",
  components: {
    AccountList,
  },
  computed: {
    ...mapState(["accounts"]),
  },
  methods: {
    ...mapActions(["fetchAccounts"]),
  },
  created() {
    if (this.accounts.accounts.length < 1) {
      this.fetchAccounts();
    }
  },
};
</script>

<style lang="scss">
.sideNav-list {
  position: absolute;
  top: 5.5rem;
  display: flex;
  flex-direction: column;
  list-style: none;
  padding: 0 1rem 2rem;
  margin: 0;
  width: 17rem;
  height: 100%;
  background: linear-gradient(to bottom, #1a1a1a, #534a65);
  background-size: contain;
}

.navLink-container {
  padding: 1rem;
  a.navLink {
    display: inline-block;
    padding-bottom: 0.5rem;
    color: #fff;
  }
  a.router-link-exact-active {
    color: $nav-purple;
    font-weight: bold;
  }
}
</style>
