import Vue from "vue";
import Vuex from "vuex";
const { createSharedMutations } = require("vuex-electron");
import { Identifier } from "./plugins/types";
import { updateViewPlugin, observePlugin, initState } from "./plugins";
export * from "./plugins";
import { registerLocale } from "./plugins/l10n";
import { emptySharedResult } from "@/common/translate/constants";
import { emptyDictResult } from "@/common/dictionary/types";

Vue.use(Vuex);

const plugins = [
  registerLocale,
  initState,
  createSharedMutations(),
  observePlugin,
  updateViewPlugin,
];

const store = new Vuex.Store({
  state: {
    languages: [],
    color: "white",
    sharedResult: emptySharedResult(),
    dictResult: emptyDictResult(),
    config: {},
  },
  mutations: {
    setShared(state, sharedResult) {
      state.sharedResult = sharedResult;
    },
    clearShared(state) {
      state.sharedResult = emptySharedResult();
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
      for (const key of Object.keys(config)) {
        Vue.set(state.config, key, config[key]);
      }
    },
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
    },
    clearShared(context) {
      context.commit("clearShared");
    },
  },
  modules: {},
  getters: {
    keys: (state) => {
      return Object.keys(state.config);
    },
  },
  plugins: plugins,
});

export default store;

export function getConfigByKey(key: Identifier) {
  return (store.state.config as any)[key];
}
