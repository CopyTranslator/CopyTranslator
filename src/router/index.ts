import Vue from "vue";
import VueRouter from "vue-router";
import Contrast from "../views/Contrast.vue";
import Settings from "../views/Settings.vue";
import Update from "../views/Update.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    redirect: "/contrast"
  },
  {
    path: "/contrast",
    name: "contrast",
    component: Contrast
  },
  {
    path: "/update",
    name: "update",
    component: Update
  },
  {
    path: "/settings",
    name: "settings",
    component: Settings
  }
];

const router = new VueRouter({
  mode: "hash",
  base: process.env.BASE_URL,
  routes
});

export default router;
