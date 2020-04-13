import Vue from "vue";
import store from "./store";
import App from "./App.vue";
import router from "./router";
import vuetify from "./vuetify"; // path to vuetify export
import { RendererController } from "./renderer";
import { IProxy } from "./core/iproxy";
import { createService } from "./tools/create";
import { authorizeKey } from "./tools/types";

const proxy = createService<IProxy>(authorizeKey);

const rendererController = RendererController.getInstance(proxy);
Vue.prototype.$t = rendererController.getT();
Vue.prototype.$proxy = proxy;
Vue.prototype.$controller = rendererController;
Vue.config.productionTip = false;

const app = new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount("#app");
