import { Identifier, authorizeKey } from "../common/types";
import store, { observers, restoreFromConfig } from "../store";
import bus from "../common/event-bus";
import createApp from "./createApp";
import Vue from "vue";

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

  handle(identifier: Identifier) {
    console.log("renderer handle", identifier);
    return false;
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
