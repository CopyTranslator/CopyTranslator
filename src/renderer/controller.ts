import { Identifier, authorizeKey } from "../common/types";
import store, { observers, restoreFromConfig } from "../store";
import bus from "../common/event-bus";
import createApp from "./createApp";
import Vue from "vue";
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

  handle(identifier: Identifier, param: any) {
    switch (identifier) {
      case "notify":
        this.notify(param);
        break;
      default:
        return false;
    }
    return true;
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
