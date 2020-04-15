import Vue from "vue";
const { VueMerge } = require("@wtfcode/vue-merge");
import { ipcMain, ipcRenderer } from "electron";
Vue.use(VueMerge); // without this Vue.merge will be undefined
const VUEX_INIT_EVENT_CONNECT = "vuex-init-connect";

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

  private loadInitialState(state: any) {
    VueMerge(this.store.state, state);
    console.log(this.store.state);
  }
}

export function initState(store: any) {
  const initState = new InitState(store);
}
export default initState;
