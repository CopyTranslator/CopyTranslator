import Vue from "vue";
const { VueMerge } = require("@wtfcode/vue-merge");
import { ipcMain, ipcRenderer } from "electron";
Vue.use(VueMerge); // without this Vue.merge will be undefined
const VUEX_INIT_EVENT_CONNECT = "vuex-init-connect";
import bus from "../../common/event-bus";
class InitState {
  isMain = process.type == "browser";
  store: any;

  constructor(store: any) {
    this.store = store;
    if (this.isMain) {
      ipcMain.on(VUEX_INIT_EVENT_CONNECT, (event, arg) => {
        event.reply(VUEX_INIT_EVENT_CONNECT, this.store.state);
      });
    } else {
      ipcRenderer.send(VUEX_INIT_EVENT_CONNECT);
      ipcRenderer.once(VUEX_INIT_EVENT_CONNECT, (event, state) => {
        this.loadInitialState(state);
        bus.at("initialized");
      });
    }
  }

  private loadInitialState(state: any) {
    VueMerge(this.store.state, state);
  }
}

export function initState(store: any) {
  const initState = new InitState(store);
}
export default initState;
