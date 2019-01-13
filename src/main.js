import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import Vuetify from "vuetify";
import "vuetify/dist/vuetify.min.css";
var remote = require("electron").remote;

Vue.use(Vuetify);
Vue.prototype.$clipboard = remote.getGlobal("clipboard");
Vue.prototype.$translate = remote.getGlobal("translate");
Vue.prototype.$ioHook = remote.getGlobal("ioHook");
Vue.prototype.$db = remote.getGlobal("db");
Vue.config.productionTip = false;




new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
