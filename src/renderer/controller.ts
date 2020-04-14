import { env } from "../tools/env";
import { initConfig } from "../tools/configuration";
import { l10n, L10N } from "../tools/l10n";
import { Identifier } from "../tools/types";
import { TranslateController } from "./translateController";
import { Controller } from "./types";
import { showDragCopyWarning } from "../tools/views/dialog";
import Vue from "vue";
import { Language } from "@opentranslate/translator";
import { app } from "electron";
import { colorRules, getColorRule } from "../tools/rule";
import { ActionManager } from "./action";
import { handleActions } from "./callback";
import currentStore, { observers } from "../store";

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
    this.action.init();
    observers.push(this);
    observers.push(this.transCon);
  }

  switchValue(identifier: Identifier) {
    this.set(identifier, !this.get(identifier));
  }

  resotreDefaultSetting() {
    this.config.restoreDefault(env.configPath);
    this.restoreFromConfig(true);
  }

  restoreFromConfig(fresh: boolean = false) {
    for (let key of this.config.keys()) {
      this.set(key, this.get(key));
    }
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
