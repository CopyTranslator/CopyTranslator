import Vue from "vue";
import Router from "vue-router";
import Focus from "./views/Focus.vue";
import Contrast from "./views/Contrast.vue";
import Settings from "./views/Settings.vue";
import Update from "./views/Update.vue";
Vue.use(Router);

export default new Router({
  base: process.env.BASE_URL,
  mode: "hash",
  routes: [
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
      path: "/update",
      name: "update",
      component: Update
    },
    {
      path: "/settings",
      name: "settings",
      component: Settings
    }
  ]
});
