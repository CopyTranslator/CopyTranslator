import Vue from "vue";
import Vuetify from "vuetify/lib";
import { getConfigByKey } from "../store";
import { ColorMode } from "../common/types";

Vue.use(Vuetify);

function isDarkMode() {
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

export default new Vuetify({
  theme: {
    dark: isDarkMode()
  },
  icons: {
    iconfont: "mdi"
  }
});
