import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import MuseUI from "muse-ui";
import { ipcRenderer } from "electron";
import { MessageType } from "./tools/enums";
import "muse-ui/dist/muse-ui.css";

import i18next from "i18next";
import VueI18Next from "@panter/vue-i18next";

const locales = {
  en: {
    hello: "Hello!",
    loadbundle: "Load bundle language: {{lang}}"
  }
};

Vue.use(VueI18Next);

i18next.init({
  lng: "en",
  resources: {
    en: { translation: locales.en }
  }
});

const i18n = new VueI18Next(i18next);

var remote = require("electron").remote;

Vue.use(MuseUI);

Vue.prototype.$ipcRenderer = ipcRenderer;
Vue.prototype.$log = remote.getGlobal("log");
Vue.prototype.$controller = remote.getGlobal("controller");

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  i18n: i18n,
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
