import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    drawer: false,
    horizontal: true
  },
  mutations: {
    switchDrawer(state, val) {
      state.drawer = val;
    },
    switchHorizontal(state, val) {
      state.horizontal = val;
    }
  },
  actions: {},
  modules: {}
});
