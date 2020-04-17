import Vue from "vue";
import Vuex from "vuex";
const { createSharedMutations } = require("vuex-electron");
import { Identifier } from "./plugins/types";
import { updateViewPlugin, observePlugin, initState } from "./plugins";
export * from "./plugins";
import { registerLocale } from "./plugins/l10n";
import bus from "../common/event-bus";

Vue.use(Vuex);

let plugins = [
  registerLocale,
  initState,
  createSharedMutations(),
  observePlugin,
  updateViewPlugin
];

const store = new Vuex.Store({
  state: {
    languages: [],
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
    setLanguages(state: any, languages: any) {
      Vue.set(state, "languages", languages);
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
    setLanguages(context: any, languages: any) {
      context.commit("setLanguages", languages);
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
  plugins: plugins
});

export default store;

export function getConfigByKey(key: Identifier) {
  return (store.state.config as any)[key];
}
