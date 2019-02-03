import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import MuseUI from "muse-ui";
import { ipcRenderer } from "electron";
import { MessageType } from "./tools/enums";
import { l10n } from "./tools/l10n";
import * as VueMenu from "@hscmap/vue-menu";
import "muse-ui/dist/muse-ui.css";

Vue.use(VueMenu);
Vue.use(MuseUI);

var remote = require("electron").remote;
var controller = remote.getGlobal("controller");

Vue.prototype.$t = controller.getT();
Vue.prototype.$ipcRenderer = ipcRenderer;
Vue.prototype.$log = remote.getGlobal("log");
Vue.prototype.$controller = controller;

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
