import { Identifier, authorizeKey, MenuActionType } from "../common/types";
import Vue from "vue";
import store, { observers, restoreFromConfig } from "../store";
import bus from "../common/event-bus";
import App from "../App.vue";
import router from "../router";
import vuetify from "../plugins/vuetify"; // path to vuetify export
import { RenController, MainController } from "../common/controller";
import { createProxy } from "../proxy/renderer";

export class RendererController extends RenController {
  private static _instance: RendererController;
  proxy = createProxy<MainController>(authorizeKey);
  app: Vue | undefined;
  keys: Identifier[] = [];

  public static getInstance(): RendererController {
    if (this._instance == null) {
      this._instance = new RendererController();
    }
    return this._instance;
  }

  private constructor() {
    super();
    this.syncKeys();
    observers.push(this);
    bus.once("initialized", () => {
      restoreFromConfig(observers, store.state.config);

      this.app = new Vue({
        router,
        store,
        vuetify,
        render: h => h(App)
      }).$mount("#app");
    });
  }

  async syncKeys() {
    this.keys = await this.proxy.keys();
  }

  postSet(identifier: Identifier, value: any): boolean {
    switch (identifier) {
      case "localeSetting":
        this.proxy.getT().then(t => {
          // Vue.prototype.$t = t;
        });
        break;
      default:
        return false;
    }
    return false;
  }

  getKeys(optionType: MenuActionType): Array<Identifier> {
    let contain: Array<Identifier> = [];
    let keys = this.keys;
    switch (optionType) {
      case "allActions":
        contain = keys;
        break;
      case "focusRight":
        contain = this.get("focusRight");
        break;
      case "contrastPanel":
        contain = this.get("contrastPanel");
        break;
      case "tray":
        contain = this.get("tray");
        break;
      case "options":
        contain = [];
        break;
      case "switches":
        contain = [];
        contain.push("restoreDefault");
        break;
      case "focusContext":
        contain = ["copy", "paste", "cut", "clear", "focus"];
        break;
      case "contrastContext":
        contain = ["copy", "paste", "cut", "clear", "copyResult", "copySource"];
        break;
    }
    return contain;
  }
}
