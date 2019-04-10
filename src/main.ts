import Vue from "vue";
import router from "./router";
import store from "./store";
import { ipcRenderer } from "electron";
import { MessageType } from "./tools/enums";
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import App from "./App.vue";
import { constants, version } from "./core/constant";

const remote = require("electron").remote;
const controller = remote.getGlobal("controller");

Vue.use(ElementUI);

Vue.prototype.$t = controller.getT();
Vue.prototype.$log = remote.getGlobal("log");
Vue.prototype.$controller = controller;

new Vue({
  router,
  store,
  render: h => h(App),
  created: function() {
    ipcRenderer.setMaxListeners(100);
    ipcRenderer.on(
      MessageType.TranslateResult.toString(),
      (event: any, arg: any) => {
        store.commit("setShared", arg);
        if (arg.notify && arg.result.length > 0) {
          new Notification(constants.appName + " " + version, {
            body: arg.result
          });
        }
        // notification.onclick = () => {
        //   console.log("通知被点击");
        // };
      }
    );
    ipcRenderer.on(MessageType.UpdateT.toString(), (event: any, arg: any) => {
      Vue.prototype.$t = controller.getT();
    });
    if (controller.res) controller.sync();
    else {
      controller.checkClipboard();
    }
  }
}).$mount("#app");
