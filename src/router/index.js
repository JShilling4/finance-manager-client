import Vue from "vue";
import VueRouter from "vue-router";
import Checkbook from "../views/Checkbook";
import AccountManagement from "../views/AccountManagement";
import CategoryManagement from "../views/CategoryManagement";
import PayeeManagement from "../views/PayeeManagement";
import Home from "../views/Home";
import { authGuard } from "../auth";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "home",
    meta: {
      title: "Finance Manager",
    },
    component: Home,
  },
  {
    path: "/checkbook",
    name: "checkbook",
    meta: {
      title: "Finance Manager | Checkbook",
    },
    component: Checkbook,
    beforeEnter: authGuard,
  },
  {
    path: "/budget",
    name: "budget",
    meta: {
      title: "Finance Manager | Budget",
    },
    component: () =>
      import(/* webpackChunkName: "budget" */ "../views/Budget.vue"),
    beforeEnter: authGuard,
  },
  {
    path: "/account-management",
    name: "accountManagement",
    meta: {
      title: "Finance Manager | Accounts",
    },
    component: AccountManagement,
    beforeEnter: authGuard,
  },
  {
    path: "/category-management",
    name: "categoryManagement",
    meta: {
      title: "Finance Manager | Categories",
    },
    component: CategoryManagement,
    beforeEnter: authGuard,
  },
  {
    path: "/payee-management",
    name: "payeeManagement",
    meta: {
      title: "Finance Manager | Payees",
    },
    component: PayeeManagement,
    beforeEnter: authGuard,
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

router.afterEach((to, from) => {
  if (to.meta && to.meta.title) {
    document.title = to.meta.title;
  }
});

export default router;
