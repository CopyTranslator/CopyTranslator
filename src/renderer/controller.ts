import { env } from "../tools/env";
import { initConfig } from "../tools/configuration";
import { l10n, L10N } from "../tools/l10n";
import { Identifier } from "../tools/types";
import { TranslateController } from "./translateController";
import { Controller } from "./types";
import { showDragCopyWarning } from "../tools/views/dialog";
import { IProxy } from "../core/iproxy";
import { Promisified } from "../tools/create";
import Vue from "vue";
import { Language } from "@opentranslate/translator";
import { app } from "electron";
import { colorRules, getColorRule } from "../tools/rule";
import { ActionManager } from "./action";
import { handleActions } from "./callback";
import currentStore from "../store";

export class RendererController implements Controller {
  config = initConfig();
  l10n: L10N = l10n;
  transCon: TranslateController = new TranslateController(this, null);
  proxy: Promisified<IProxy>;
  action = new ActionManager(handleActions, this);

  private static _instance: RendererController;

  public static getInstance(proxy?: Promisified<IProxy>): RendererController {
    if (this._instance == null && proxy != undefined) {
      this._instance = new RendererController(proxy);
    }
    return this._instance;
  }

  private constructor(proxy: Promisified<IProxy>) {
    this.proxy = proxy;
    this.action.init();
  }

  switchValue(identifier: Identifier) {
    this.set(identifier, !this.get(identifier));
  }

  onExit() {
    app.exit();
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
    if (this.config.set(identifier, value)) {
      this.postSet(identifier, value);
      return true;
    }
    return false;
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

  postSet(identifier: Identifier, value: any) {
    switch (identifier) {
      case "stayTop":
        // if (this.win.window) {
        //   this.win.window.focus();
        //   this.win.window.setAlwaysOnTop(value);
        // }
        break;
      case "skipTaskbar":
        // this.win.setSkipTaskbar(value);
        break;
      case "dragCopy":
        if (value) {
          showDragCopyWarning();
        }
        // windowController.dragCopy = value;
        break;
      case "localeSetting":
        Vue.prototype.$t = this.getT();
        break;
    }
  }
}
