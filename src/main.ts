import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import MuseUI from "muse-ui";
import { ipcRenderer } from "electron";
import { MessageType } from "./tools/enums";
import "muse-ui/dist/muse-ui.css";

Vue.use(MuseUI);

var remote = require("electron").remote;
var controller = remote.getGlobal("controller");

Vue.prototype.$t = controller.getT();
Vue.prototype.$log = remote.getGlobal("log");
Vue.prototype.$controller = controller;

new Vue({
  router,
  store,
  render: h => h(App),
  created: function() {
    ipcRenderer.on(
      MessageType.TranslateResult.toString(),
      (event: any, arg: any) => {
        store.commit("setShared", arg);
      }
    );
  }
}).$mount("#app");
