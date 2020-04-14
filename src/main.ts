import Vue from "vue";
import store from "./store";
import App from "./App.vue";
import router from "./router";
import vuetify from "./plugins/vuetify"; // path to vuetify export
import { RendererController } from "./renderer";
import bus from "./common/event-bus";
const rendererController = RendererController.getInstance();
Vue.prototype.$t = rendererController.getT();
Vue.prototype.$controller = rendererController;
Vue.config.productionTip = false;

const app = new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount("#app");

(window as any).requestIdleCallback(() => {
  bus.gat("firstLoad");
});
