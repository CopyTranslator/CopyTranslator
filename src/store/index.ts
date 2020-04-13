import Vue from "vue";
import Vuex from "vuex";
import { LayoutType } from "../tools/types";
const {
  createPersistedState,
  createSharedMutations
} = require("vuex-electron");

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    drawer: true,
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
    },
    config: {}
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
    },
    setConfig(state, config) {
      Vue.set(state, "config", config);
    },
    updateConfig(state, config) {
      for (let key of Object.keys(config)) {
        Vue.set(state.config, key, config[key]);
      }
    }
  },
  actions: {
    switchDrawer(context, val) {
      context.commit("switchDrawer", val);
    },
    setLayoutType(context, val: LayoutType) {
      context.commit("setLayoutType", val);
    },
    setShared(context, sharedResult) {
      context.commit("setShared", sharedResult);
    },
    setDictResult(context, dictResult) {
      context.commit("setDictResult", dictResult);
    },
    setConfig(context, config) {
      context.commit("setConfig", config);
    },
    updateConfig(context, config) {
      context.commit("updateConfig", config);
    }
  },
  modules: {},
  getters: {
    keys: state => {
      return Object.keys(state.config);
    }
  },
  plugins: [createPersistedState(), createSharedMutations()]
});
