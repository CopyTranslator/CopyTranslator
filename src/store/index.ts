import Vue from "vue";
import Vuex from "vuex";
import { LayoutType } from "../tools/types";
const {
  createPersistedState,
  createSharedMutations
} = require("vuex-electron");
import { app } from "electron";
import { Identifier } from "../tools/types";
import { EventBus } from "../renderer/event-bus";

Vue.use(Vuex);

interface Mutation {
  type: string;
  payload: any;
}

interface Observer {
  postSet(key: Identifier, value: any): boolean; //返回值用来指示是否处理完毕
}

export let observers: Observer[] = [];

const observePlugin = (store: any) => {
  // 当 store 初始化后调用
  store.subscribe((mutation: Mutation, state: any) => {
    // 每次 mutation 之后调用
    // mutation 的格式为 { type, payload }
    if (["setConfig", "updateConfig"].indexOf(mutation.type) == -1) {
      return;
    }
    for (let key of Object.keys(mutation.payload)) {
      const val = mutation.payload[key];
      for (const observer of observers) {
        const resolved = observer.postSet(key as Identifier, val);
        if (resolved) {
          break;
        }
      }
    }
  });
};

//协同响应
const connections: Map<Identifier, Identifier[]> = new Map([
  ["translatorType", ["sourceLanguage", "targetLanguage"]]
]);

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
        const links = connections.get(key as Identifier);
        if (links && process.type == "renderer") {
          links.forEach(link => EventBus.$emit(link));
        }
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
  plugins: [createPersistedState(), createSharedMutations(), observePlugin]
});

export default store;

export function getConfigByKey(key: Identifier) {
  return (store.state.config as any)[key];
}
