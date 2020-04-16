import { Identifier, authorizeKey, MenuActionType } from "../common/types";
import Vue from "vue";
import store, { observers, restoreFromConfig } from "../store";
import bus from "../common/event-bus";
import App from "../App.vue";
import router from "../router";
import vuetify from "../plugins/vuetify"; // path to vuetify export
import { RenController, MainController } from "../common/controller";
import { createProxy } from "../proxy/renderer";
import { ActionManager } from "../common/action";

export class RendererController extends RenController {
  private static _instance: RendererController;
  proxy = createProxy<MainController>(authorizeKey);
  app: Vue | undefined;
  keys: Identifier[] = [];
  action: ActionManager = new ActionManager(this.config);

  public static getInstance(): RendererController {
    if (this._instance == null) {
      this._instance = new RendererController();
    }
    return this._instance;
  }

  private constructor() {
    super();
    observers.push(this);
    this.action.init();
    bus.once("initialized", () => {
      restoreFromConfig(observers, store.state.config);
      this.app = new Vue({
        router,
        store,
        vuetify,
        render: h => h(App)
      }).$mount("#app");
    });
    Vue.prototype.$t = (text: string) => {
      return store.getters.locale[text];
    };
  }

  postSet(identifier: Identifier, value: any): boolean {
    switch (identifier) {
      case "localeSetting":
        break;
      default:
        return false;
    }
    return false;
  }
}
