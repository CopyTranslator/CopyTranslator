import Vue from "vue";
import Vuex from "vuex";
import { GoogleLangList } from "./tools/languages";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    sharedResult: {
      src: "",
      result: "",
      source: "",
      target: ""
    },
    languages: GoogleLangList
  },
  mutations: {
    setShared(state, sharedResult) {
      state.sharedResult = sharedResult;
    }
  },
  actions: {}
});
