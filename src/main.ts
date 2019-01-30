import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import Vuetify from "vuetify";
import "vuetify/dist/vuetify.min.css";
import { ipcRenderer } from "electron";

var remote = require("electron").remote;

Vue.use(Vuetify);

Vue.prototype.$ipcRenderer = ipcRenderer;
Vue.prototype.$log = remote.getGlobal("logger");

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
