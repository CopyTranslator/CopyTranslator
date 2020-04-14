import Vue from "vue";
import Vuex from "vuex";
const { createSharedMutations } = require("vuex-electron");
import { app } from "electron";
import { Identifier, Mutation } from "./plugins/types";
import { updateViewPlugin, observePlugin, initState } from "./plugins";
export { observers } from "./plugins";

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    defaultLocale: app ? app.getLocale() : "en",
    color: "white",
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
    setShared(state, sharedResult) {
      state.sharedResult = sharedResult;
    },
    setDictResult(state, dictResult) {
      state.dictResult = dictResult;
    },
    setColor(state, color) {
      state.color = color;
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
    setShared(context, sharedResult) {
      context.commit("setShared", sharedResult);
    },
    setDictResult(context, dictResult) {
      context.commit("setDictResult", dictResult);
    },
    setColor(context, color) {
      context.commit("setColor", color);
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
  plugins: [initState, createSharedMutations(), observePlugin, updateViewPlugin]
});

export default store;

export function getConfigByKey(key: Identifier) {
  return (store.state.config as any)[key];
}
