// ---------------------------
// Electron 共享总线，基于Vuex-electron
// modified from https://github.com/gotoeasy/npm-packages/blob/master/bus/index.js
// ---------------------------
import Vue from "vue";
const isMain = process.type == "browser";

function setTypeSet(state: any, args: [string, boolean, boolean]) {
  const busEvents = state.busEvents;
  const [channel, main, del] = args;
  const index = main ? 0 : 1;
  let typeSet: [boolean, boolean];
  if (busEvents[channel] != undefined) {
    typeSet = busEvents[channel];
  } else {
    typeSet = [false, false];
  }
  typeSet[index] = !del;
  Vue.set(busEvents, channel, typeSet);
  console.log(channel, typeSet);
}

const sharedModule = {
  state: {
    busEvents: {}
  },
  getters: {
    events(state: any) {
      return state.busEvents;
    }
  },
  mutations: {
    event(state: any, args: [string, boolean, boolean]) {
      setTypeSet(state, args);
    }
  },
  actions: {
    event(context: any, args: [string, boolean]) {
      context.commit("event", args);
    }
  }
};

export default (store: any) => {
  store.registerModule("bus", sharedModule);
};

type FuncSet = Set<Function>;

export class ElectronBus<T> {
  store: any = undefined;
  map = new Map<T, FuncSet>();
  constructor(store?: any) {
    if (store) {
      this.store = store;
    }
  }

  addEvent(channel: T) {
    if (this.store) {
      this.store.dispatch("event", [channel, isMain, false]);
    }
  }

  delEvent(channel: T) {
    if (this.store) {
      this.store.dispatch("event", [channel, isMain, true]);
    }
  }

  checkChannel(channel: T) {
    let flags: [boolean, boolean] | undefined;
    if (this.store) {
      flags = this.store.getters.events[channel];
    }
    if (!flags) {
      flags = [false, false];
      const index = isMain ? 0 : 1;
      flags[index] = this.map.has(channel);
    }
    const [main, renderer] = flags;
    return {
      main,
      renderer
    };
  }

  sendEvent() {}

  // 安装事件函数
  on(channel: T, func: Function): void {
    let setFn = this.map.get(channel) as FuncSet;
    if (!setFn) {
      setFn = new Set<Function>();
      this.map.set(channel, setFn);
      this.addEvent(channel);
    }
    setFn.add(func);
  }

  delChannel(channel: T) {
    this.map.delete(channel);
    this.delEvent(channel);
  }

  // 卸载事件函数
  off(channel: T, func?: Function) {
    const setFn = this.map.get(channel) as FuncSet;
    if (!setFn) {
      return;
    }
    if (!func) {
      this.delChannel(channel);
      return;
    }
    setFn.delete(func);
    if (setFn.size == 0) {
      this.delChannel(channel);
    }
  }

  // 安装事件函数，函数仅执行一次
  once(channel: T, fn: Function): void {
    (fn as any)["ONCE_" + channel] = true; // 加上标记
    this.on(channel, fn);
  }

  // 通知执行事件函数
  at(channel: T, ...args: any[]): void {
    const setFn = this.map.get(channel) as FuncSet;
    console.log("check", this.checkChannel(channel));
    if (setFn != undefined && setFn.size != 0) {
      setFn.forEach((func: any) => {
        return new Promise((resolve, reject) => {
          func(...args);
          if (func["ONCE_" + channel]) {
            this.off(channel, func);
            delete func["ONCE_" + channel]; // 若是仅执行一次的函数则删除关联
          }
          resolve();
        });
      });
    }
  }

  clear() {
    this.map.clear();
  }
}
