<template>
  <div class="accountList">
    <h2>Accounts</h2>
    <ul>
      <li v-for="(account, index) in accounts" :key="index">
        {{ account.name }} - ${{ account.balance | formatNumber }}
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: "AccountList",
  components: {},
  props: {
    accounts: {
      type: Array,
    },
  },
  data() {
    return {};
  },
};
</script>

<style lang="scss" scoped>
.accountList {
  padding: 1rem;
  background-color: #fff;
}
h2 {
  text-decoration: underline;
  margin-bottom: 0.5rem;
}
ul {
  max-width: 100%;
  list-style: none;
  margin: 0;
  padding: 0;

  li {
    cursor: pointer;
  }
}
</style>
