import Vue from "vue";
import Vuex from "vuex";
const { createSharedMutations } = require("vuex-electron");
import { Identifier } from "./plugins/types";
import { updateViewPlugin, observePlugin, initState } from "./plugins";
export * from "./plugins";
import { registerLocale } from "./plugins/l10n";
import { emptySharedResult } from "@/common/translate/types";
import { emptyDictResult } from "@/common/dictionary/types";

Vue.use(Vuex);

const plugins = [
  registerLocale,
  initState,
  createSharedMutations(),
  observePlugin,
  updateViewPlugin,
];

// renderer在config里存放多层的对象，可能会出现丢失的情况，尽量不要这样子做，应该像Languages那样
const store = new Vuex.Store({
  state: {
    status: "None",
    sharedResult: emptySharedResult(),
    dictResult: emptyDictResult(),
    config: {},
    languages: { sources: [], targets: [] },
    resultBuffer: {},
  },
  mutations: {
    setShared(state, sharedResult) {
      state.sharedResult = sharedResult;
    },
    setDictResult(state, dictResult) {
      state.dictResult = dictResult;
    },
    setStatus(state, status) {
      state.status = status;
    },
    setLanguages(state, languages) {
      Vue.set(state, "languages", languages);
    },
    setResultBuffer(state, resultBuffer) {
      Vue.set(state, "resultBuffer", resultBuffer);
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
    setDictResult(context, dictResult) {
      context.commit("setDictResult", dictResult);
    },
    setStatus(context, status) {
      context.commit("setStatus", status);
    },
    setLanguages(context, languages) {
      context.commit("setLanguages", languages);
    },
    setResultBuffer(context, resultBuffer) {
      context.commit("setResultBuffer", resultBuffer);
    },
    setConfig(context, config) {
      context.commit("setConfig", config);
    },
    updateConfig(context, config) {
      context.commit("updateConfig", config);
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
