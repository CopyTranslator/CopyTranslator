import store from "../store";
import App from "../App.vue";
import router from "../router";
import Vue from "vue";
import Vuetify from "vuetify/lib";
import { getConfigByKey } from "../store";
import { ColorMode } from "../common/types";
import "@mdi/font/css/materialdesignicons.css";

Vue.use(Vuetify);

export function isDarkMode() {
  const colorMode: ColorMode = getConfigByKey("colorMode");
  switch (colorMode) {
    case "light":
      return false;
    case "dark":
      return true;
    case "auto":
      if (window.matchMedia("(prefers-color-scheme:dark)").matches) {
        return true;
      } else {
        return false;
      }
  }
}

export default () => {
  //如果要获取配置值要在这里获取，不然获取不到
  const themes = {
    light: {
      primary: getConfigByKey("primaryColor").light,
    },
    dark: {
      primary: getConfigByKey("primaryColor").dark,
    },
  };
  return new Vue({
    router,
    store,
    vuetify: new Vuetify({
      theme: {
        dark: isDarkMode(),
        options: { customProperties: true },
        themes,
      },
      icons: {
        iconfont: "mdi",
      },
    }),
    render: (h) => h(App),
  }).$mount("#app");
};
