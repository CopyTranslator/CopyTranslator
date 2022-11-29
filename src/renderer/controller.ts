import { Identifier, authorizeKey } from "../common/types";
import store, { observers, restoreFromConfig } from "../store";
import bus from "../common/event-bus";
import createApp, { isDarkMode } from "./createApp";
import Vue from "vue";
import Toasted from "vue-toasted";
const Options = {
  position: "bottom-center",
  duration: 5000,
  iconPack: "mdi",
  // icon: "info",
  singleton: true,
};
import config from "../common/configuration";
Vue.use(Toasted, Options);
import logger, { initLog } from "../common/logger";

import { constants, versionString } from "../common/constant";
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
    initLog();
    observers.push(this);
    bus.once("initialized", () => {
      restoreFromConfig(observers, store.state.config);
      this.initApp();
    });
  }

  initApp() {
    this.app = createApp();
  }

  notify(text: string) {
    if (text.length > 0) {
      new Notification(constants.appName + " " + versionString, {
        body: text,
      });
    }
  }

  toast(text: string, force: boolean = false) {
    if (force || config.get("toastTip")) {
      Vue.toasted.show(text);
    }
  }

  handle(identifier: Identifier, param: any) {
    switch (identifier) {
      case "notify":
        this.notify(param);
        break;
      case "toast":
        this.toast(param);
        break;
      case "translateInput":
        bus.at("translateInput");
        break;
      default:
        return false;
    }
    return true;
  }

  postSet(identifier: Identifier, value: any): boolean {
    switch (identifier) {
      case "primaryColor": //动态更新主题颜色
        if (this.app != undefined) {
          this.app.$vuetify.theme.themes.light.primary = value;
          this.app.$vuetify.theme.themes.dark.primary = value;
        }
        break;
      case "colorMode": //动态更新暗黑明亮模式
        if (this.app != undefined) {
          this.app.$vuetify.theme.dark = isDarkMode();
        }
        break;
      case "localeSetting":
        break;
      case "layoutType":
        bus.at("dispatch", "toast", value.toString() + " 布局");
        break;
      default:
        return false;
    }
    return false;
  }
}
