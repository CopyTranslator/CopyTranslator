// src/plugins/vuetify.js

import Vue from "vue";
import Vuetify from "vuetify/lib";

Vue.use(Vuetify);

function isDarkMode() {
  if (window.matchMedia("(prefers-color-scheme:dark)").matches) {
    return true;
  } else {
    return false;
  }
}

export default new Vuetify({
  theme: {
    dark: isDarkMode()
  }
});
