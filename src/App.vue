<template>
  <div id="app">
    <v-app>
      <div id="nav">
        <router-link to="/">Checkbook</router-link> |
        <router-link to="/about">Budget</router-link>
      </div>
      <side-nav />
      <router-view />
    </v-app>
  </div>
</template>

<script>
import SideNav from "@/components/SideNav";
export default {
  components: {
    "side-nav": SideNav,
  },
  data() {
    return {};
  },
  computed: {},
  methods: {},
};
</script>

<style lang="scss">
// LAYOUT
html {
  height: 100%;
}
body {
  margin: 0;
  background: linear-gradient(to top, #858585, #9e9e9e);
  background-repeat: no-repeat;
  background-size: 100% 100%;
}

// BUTTONS
.control {
  color: skyblue;
  font-size: 0.9em;
  margin: 0 1rem;
  padding: 0.5rem 0;
  text-align: center;
  width: 11rem;
  text-transform: uppercase;
  border: 1px solid black;
  border-radius: 5px;
  cursor: pointer;
}

// NAVIGATION
#nav {
  display: flex;
  justify-content: flex-end;
  padding: 2rem;
  background: linear-gradient(to top, #1a1a1a, #534a65);
  color: #fff;
  a {
    padding: 0 1rem;
    font-weight: bold;
    color: #fff;
    &.router-link-exact-active {
      color: $nav-purple;
    }
  }
}

// LINKS
a {
  text-decoration: none;
  color: #ffffff;
}

// LISTS
ul {
  list-style: none;
  padding-left: 0 !important;
}

// FORMS
.form-group {
  margin: 1rem 0;
}
label {
  color: #333333;
}

// MODALS
.modal-footer-controls {
  display: flex;
  justify-content: space-between;
  margin: 2rem 0 0;
}

// ICONS
.fas {
  cursor: pointer;
}

// HELPERS
.statusCleared {
  color: $checkboxGreen;
}
</style>
