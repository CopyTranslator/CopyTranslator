// ---------------------------
// Electron 共享总线，基于Vuex-electron
// modified from https://github.com/gotoeasy/npm-packages/blob/master/bus/index.js
// ---------------------------
import Vue from "vue";
const isMain = process.type == "browser";
import {
  ipcMain,
  ipcRenderer,
  IpcMainEvent,
  IpcRendererEvent,
  BrowserWindow
} from "electron";
const ipc = isMain ? ipcMain : ipcRenderer;
type Event = IpcMainEvent | IpcRendererEvent | null;
type Listener = (event: Event, ...args: any[]) => void | Function;

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
    },
    clearEvents(state: any, main: boolean) {
      let busEvents = state.busEvents;
      const index = isMain ? 0 : 1;
      for (const key of Object.keys(busEvents)) {
        busEvents[key][index] = false;
      }
      Vue.set(state, "busEvents", busEvents);
    }
  },
  actions: {
    event(context: any, args: [string, boolean]) {
      context.commit("event", args);
    },
    clearEvents(context: any, main: boolean) {
      context.commit("clearEvents", main);
    }
  }
};

export default (store: any) => {
  store.registerModule("bus", sharedModule);
};

type FuncSet = Set<Listener>;

export class ElectronBus<T extends string> {
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

  needInter(channel: T) {
    let flags: [boolean, boolean] | undefined;
    if (!this.store) {
      return false;
    }
    flags = this.store.getters.events[channel];
    if (!flags) {
      return false;
    }
    const otherIndex = isMain ? 1 : 0;
    return flags[otherIndex];
  }

  sendEvent(channel: T, ...args: any[]) {
    if (!isMain) {
      ipcRenderer.send(channel, ...args);
    } else {
      BrowserWindow.getAllWindows().forEach(e => {
        e.webContents.send(channel, ...args);
      });
    }
  }

  // 安装事件函数
  on(channel: T, func: Listener): void {
    let setFn = this.map.get(channel) as FuncSet;
    if (!setFn) {
      setFn = new Set<Listener>();
      this.map.set(channel, setFn);
      this.addEvent(channel);
    }
    setFn.add(func);
    ipc.on(channel, func);
  }

  delChannel(channel: T) {
    this.map.delete(channel);
    ipc.removeAllListeners(channel);
    this.delEvent(channel);
  }

  // 卸载事件函数
  off(channel: T, func?: Listener) {
    const setFn = this.map.get(channel) as FuncSet;
    if (!setFn) {
      return;
    }
    if (!func) {
      this.delChannel(channel);
      return;
    }
    setFn.delete(func);
    ipc.removeListener(channel, func);
    if (setFn.size == 0) {
      this.delChannel(channel);
    }
  }

  // 安装事件函数，函数仅执行一次
  once(channel: T, fn: Listener): void {
    (fn as any)["ONCE_" + channel] = true; // 加上标记
    this.on(channel, fn);
  }

  // 通知执行事件函数
  at(channel: T, ...args: any[]): void {
    console.log(this.needInter(channel));
    if (this.needInter(channel)) {
      this.sendEvent(channel, ...args);
    }
    const setFn = this.map.get(channel) as FuncSet;
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
    if (this.store) {
      this.store.dispatch("clearEvents", isMain);
    }
  }
}
