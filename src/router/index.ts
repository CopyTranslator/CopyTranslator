import Vue from "vue";
import VueRouter from "vue-router";

const Contrast = () => import("@/views/Contrast.vue");
const Settings = () => import("@/views/Settings.vue");

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    redirect: "/contrast",
  },
  {
    path: "/contrast",
    name: "contrast",
    component: Contrast,
  },
  {
    path: "/settings",
    name: "settings",
    component: Settings,
  },
];

const router = new VueRouter({
  mode: "hash",
  base: process.env.BASE_URL,
  routes,
});

export default router;
