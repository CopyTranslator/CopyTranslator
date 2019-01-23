import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import Vuetify from "vuetify";
import "vuetify/dist/vuetify.min.css";
import { ipcRenderer } from "electron";

var remote = require("electron").remote;

Vue.use(Vuetify);
Vue.prototype.$clipboard = remote.getGlobal("clipboard");
Vue.prototype.$translate = remote.getGlobal("translator");
Vue.prototype.$ioHook = remote.getGlobal("ioHook");
Vue.prototype.$db = remote.getGlobal("db");
Vue.prototype.$CONSTANT = remote.getGlobal("CONSTANT");
Vue.prototype.$ipcRenderer = ipcRenderer;
Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
