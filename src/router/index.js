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
    meta: {
      title: "Finance Manager | Checkbook",
    },
    component: Checkbook,
  },
  {
    path: "/budget",
    name: "budget",
    meta: {
      title: "Finance Manager | Budget",
    },
    component: () =>
      import(/* webpackChunkName: "budget" */ "../views/Budget.vue"),
  },
  {
    path: "/account-management",
    name: "accountManagement",
    meta: {
      title: "Finance Manager | Accounts",
    },
    component: AccountManagement,
  },
  {
    path: "/category-management",
    name: "categoryManagement",
    meta: {
      title: "Finance Manager | Categories",
    },
    component: CategoryManagement,
  },
  {
    path: "/payee-management",
    name: "payeeManagement",
    meta: {
      title: "Finance Manager | Payees",
    },
    component: PayeeManagement,
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
