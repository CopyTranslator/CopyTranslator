import Vue from "vue";
import VueRouter from "vue-router";
import Contrast from "../views/Contrast.vue";
import Settings from "../views/Settings.vue";
import Focus from "../views/Focus.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    redirect: "/focus"
  },
  {
    path: "/focus",
    name: "focus",
    component: Focus
  },
  {
    path: "/contrast",
    name: "contrast",
    component: Contrast
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
