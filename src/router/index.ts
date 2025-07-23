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
      path: "/transaksi/detail/:id",
      name: "transaksi-detail",
      component: () => import("../views/TransaksiDetailView.vue")
    },

    {
      path: "/kasir-coopzone",
      name: "kasir-coopzone-home",
      component: HomeView,
    },
    {
      path: "/kasir-coopzone/transaksi",
      name: "kasir-coopzone-transaksi",
      component: () => import("../views/TransaksiView.vue"),
    },
    {
      path: "/kasir-coopzone/transaksi/detail/:id",
      name: "kasir-coopzone-transaksi-detail",
      component: () => import("../views/TransaksiDetailView.vue"),
    },
    {
      path : "/product",
      name : "product",
      component: () => import("../views/ProductView.vue")
    }
  ],
});

export default router;
