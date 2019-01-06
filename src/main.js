import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
var remote = require("electron").remote;

Vue.prototype.$db = remote.getGlobal("db");
Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
