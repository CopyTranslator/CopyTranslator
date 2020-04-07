import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import vuetify from "./vuetify"; // path to vuetify export
import { ipcRenderer } from "electron";
import { MessageType } from "./tools/enums";
import { constants, versionString } from "./core/constant";
import { IProxy } from "./core/iproxy";
import { createService } from "./tools/create";
import { authorizeKey } from "./tools/types";

const proxy = createService<IProxy>(authorizeKey);
const remote = require("electron").remote;
const controller = remote.getGlobal("controller");

Vue.prototype.$t = controller.getT();
Vue.prototype.$proxy = proxy;
Vue.config.productionTip = false;

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App),
  created: function() {
    ipcRenderer.setMaxListeners(100);
    ipcRenderer.on(
      MessageType.TranslateResult.toString(),
      (event: any, arg: any) => {
        store.commit("setShared", arg);
        if (arg.notify && arg.result.length > 0) {
          new Notification(constants.appName + " " + versionString, {
            body: arg.result
          });
        }
      }
    );
    ipcRenderer.on(
      MessageType.DictResult.toString(),
      (event: any, arg: any) => {
        store.commit("setDictResult", arg);
      }
    );
    ipcRenderer.on(MessageType.UpdateT.toString(), (event: any, arg: any) => {
      Vue.prototype.$t = controller.getT();
    });
    proxy.checkSync();
  }
}).$mount("#app");
