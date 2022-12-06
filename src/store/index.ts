import Vue from "vue";
import Vuex from "vuex";
const { createSharedMutations } = require("vuex-electron");
import { Identifier } from "./plugins/types";
import { updateViewPlugin, observePlugin, initState } from "./plugins";
export * from "./plugins";
import { registerLocale } from "./plugins/l10n";
import { emptySharedResult, emptySharedDiff } from "@/common/translate/types";
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
    status: "None",
    sharedResult: emptySharedResult(),
    sharedDiff: emptySharedDiff(),
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
    setDiff(state, sharedDiff) {
      state.sharedDiff = sharedDiff;
    },
    setDictResult(state, dictResult) {
      state.dictResult = dictResult;
    },
    setStatus(state, status) {
      state.status = status;
    },
    setConfig(state, config) {
      Vue.set(state, "config", config);
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
    setDiff(context, sharedDiff) {
      context.commit("setDiff", sharedDiff);
    },
    setDictResult(context, dictResult) {
      context.commit("setDictResult", dictResult);
    },
    setStatus(context, status) {
      context.commit("setStatus", status);
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
