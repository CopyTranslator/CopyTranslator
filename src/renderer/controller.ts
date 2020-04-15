import { env } from "../common/env";
import { initConfig } from "../common/configuration";
import { l10n, L10N } from "./l10n";
import { Identifier } from "../common/types";
import { TranslateController } from "./translateController";
import { Controller } from "./types";
import Vue from "vue";
import { Language } from "@opentranslate/translator";
import { colorRules, getColorRule } from "../common/rule";
import { ActionManager } from "./action";
import { handleActions } from "./callback";
import store, { observers, restoreFromConfig } from "../store";
import { ElectronBus } from "../store/plugins/shared-bus";

export class RendererController implements Controller {
  config = initConfig();
  l10n: L10N = l10n;
  transCon: TranslateController = new TranslateController(this);
  action = new ActionManager(handleActions, this);

  private static _instance: RendererController;

  public static getInstance(): RendererController {
    if (this._instance == null) {
      this._instance = new RendererController();
    }
    return this._instance;
  }

  private constructor() {
    observers.push(this);
    observers.push(this.transCon);
    this.restoreFromConfig();
    this.action.init();

    const bus = new ElectronBus<"hello">(store);
    bus.on("hello", () => {
      console.log("!!!!!");
    });

    bus.on("hello", () => {
      console.log("????????");
    });
    // bus.off("hello");
    bus.at("hello");
  }

  switchValue(identifier: Identifier) {
    this.set(identifier, !this.get(identifier));
  }

  resotreDefaultSetting() {
    this.config.restoreDefault(env.configPath);
    this.restoreFromConfig();
  }

  restoreFromConfig() {
    restoreFromConfig(observers, store.state.config);
  }

  get<T>(identifier: Identifier) {
    return this.config.get(identifier) as T;
  }

  set(identifier: Identifier, value: any): boolean {
    return this.config.set(identifier, value);
  }

  getT() {
    let locale = this.get<Language>("localeSetting");
    return this.l10n.getT(locale);
  }

  getOptions() {
    let realOptions = 0;
    for (const [key, value] of colorRules) {
      if (this.get<boolean>(key)) {
        realOptions |= value;
      }
    }
    return realOptions;
  }

  setUpRecognizer(APP_ID: string, API_KEY: string, SECRET_KEY: string) {
    this.set("APP_ID", APP_ID);
    this.set("API_KEY", API_KEY);
    this.set("SECRET_KEY", SECRET_KEY);
    // recognizer.setUp(true);
  }

  postSet(identifier: Identifier, value: any): boolean {
    switch (identifier) {
      case "localeSetting":
        Vue.prototype.$t = this.getT();
        break;
      default:
        return false;
    }
    return true;
  }
}
