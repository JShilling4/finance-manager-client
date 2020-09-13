import Vue from "vue";
import VueRouter from "vue-router";
import Checkbook from "../views/Checkbook";
import AccountManagement from "../views/AccountManagement";
import CategoryManagement from "../views/CategoryManagement";
import PayeeManagement from "../views/PayeeManagement";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "checkbook",
    component: Checkbook,
  },
  {
    path: "/budget",
    name: "budget",
    component: () =>
      import(/* webpackChunkName: "budget" */ "../views/Budget.vue"),
  },
  {
    path: "/account-management",
    name: "accountManagement",
    component: AccountManagement,
  },
  {
    path: "/category-management",
    name: "categoryManagement",
    component: CategoryManagement,
  },
  {
    path: "/payee-management",
    name: "payeeManagement",
    component: PayeeManagement,
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
