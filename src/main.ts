import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import Vuetify from "vuetify";
import "vuetify/dist/vuetify.min.css";
import { ipcRenderer } from "electron";
import { MessageType } from "./tools/enums";

var remote = require("electron").remote;

Vue.use(Vuetify);

Vue.prototype.$ipcRenderer = ipcRenderer;
Vue.prototype.$log = remote.getGlobal("log");

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App),
  created: function() {
    ipcRenderer.on(
      MessageType.TrnaslateResult.toString(),
      (event: any, arg: any) => {
        store.commit("setShared", arg);
      }
    );
  }
}).$mount("#app");
