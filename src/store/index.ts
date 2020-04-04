import Vue from "vue";
import Vuex from "vuex";
import { LayoutType } from "../tools/types";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    drawer: false,
    layoutType: "horizontal",
    sharedResult: {
      src: "",
      result: "",
      source: "",
      target: "",
      engine: "",
      notify: false
    },
    dictResult: {
      valid: false,
      phonetics: [],
      explains: [],
      examples: [],
      code: 0,
      engine: "",
      url: "",
      words: ""
    }
  },
  mutations: {
    switchDrawer(state, val) {
      state.drawer = val;
    },
    setLayoutType(state, val: LayoutType) {
      state.layoutType = val;
    },
    setShared(state, sharedResult) {
      state.sharedResult = sharedResult;
    },
    setDictResult(state, dictResult) {
      state.dictResult = dictResult;
    }
  },
  actions: {},
  modules: {}
});
