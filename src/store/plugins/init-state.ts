const merge = require("deepmerge");
const VUEX_INIT_EVENT_CONNECT = "vuex-init-connect";

import { ipcMain, ipcRenderer } from "electron";

class InitState {
  isMain = process.type == "browser";
  store: any;

  constructor(store: any) {
    this.store = store;
    if (this.isMain) {
      ipcMain.on(VUEX_INIT_EVENT_CONNECT, (event, arg) => {
        event.returnValue = this.store.state;
      });
    } else {
      let state = ipcRenderer.sendSync(VUEX_INIT_EVENT_CONNECT);
      this.loadInitialState(state);
    }
  }

  combineMerge(target: any, source: any, options: any) {
    const emptyTarget = (value: any) => (Array.isArray(value) ? [] : {});
    const clone = (value: any, options: any) =>
      merge(emptyTarget(value), value, options);
    const destination = target.slice();

    source.forEach(function(e: any, i: any) {
      if (typeof destination[i] === "undefined") {
        const cloneRequested = options.clone !== false;
        const shouldClone = cloneRequested && options.isMergeableObject(e);
        destination[i] = shouldClone ? clone(e, options) : e;
      } else if (options.isMergeableObject(e)) {
        destination[i] = merge(target[i], e, options);
      } else if (target.indexOf(e) === -1) {
        destination.push(e);
      }
    });

    return destination;
  }

  private loadInitialState(state: any) {
    const mergedState = merge(this.store.state, state, {
      arrayMerge: this.combineMerge
    });
    this.store.replaceState(mergedState);
  }
}

export function initState(store: any) {
  const initState = new InitState(store);
}
export default initState;
