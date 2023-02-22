import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
    },
    {
      path: "/transaksi",
      name: "transaksi",
      component: () => import("../views/TransaksiView.vue"),
    },
    {
      path : "/product",
      name : "product",
      component: () => import("../views/ProductView.vue")
    }
  ],
});

export default router;
