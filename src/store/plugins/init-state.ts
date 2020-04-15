import Vue from "vue";
const { VueMerge } = require("@wtfcode/vue-merge");
import { ipcMain, ipcRenderer } from "electron";
Vue.use(VueMerge); // without this Vue.merge will be undefined
const VUEX_INIT_EVENT_CONNECT = "vuex-init-connect";
import bus from "../../common/event-bus";
import dayjs from "dayjs";
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
      const now = dayjs();
      ipcRenderer.once(VUEX_INIT_EVENT_CONNECT, (event, state) => {
        console.log(dayjs().diff(now, "second"));
        this.loadInitialState(state);
        console.log(dayjs().diff(now, "second"));
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
