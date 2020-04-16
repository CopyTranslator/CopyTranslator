import { Window } from "../common/views/windows";
import { eventListener } from "../common/event-listener";
import { TrayManager } from "../common/tray";
import { recognizer } from "../common/ocr";
import { Identifier, authorizeKey, ActionView } from "../common/types";
import { startService } from "../proxy/main";
import { initConfig } from "../common/configuration";
import { ShortcutManager } from "./shortcut";
import { app } from "electron";
import { env } from "../common/env";
import store, { observers, restoreFromConfig } from "../store";
import { Language } from "@opentranslate/languages";
import { TranslateController } from "./translateController";
import { l10n, L10N } from "./l10n";
import { ActionManager } from "./action";
import { handleActions } from "./callback";
import { CommonController, MainController } from "../common/controller";

class Controller extends MainController {
  win: Window = new Window();
  tray: TrayManager = new TrayManager();
  shortcut: ShortcutManager = new ShortcutManager();
  l10n: L10N = l10n;

  transCon = new TranslateController(this);
  action: ActionManager = new ActionManager(handleActions, this);

  getAction(id: Identifier) {
    return this.action.getAction("autoCopy") as ActionView;
  }

  constructor() {
    super();
    this.config.load(env.configPath);
    observers.push(this);
    observers.push(this.transCon);
  }

  createWindow() {
    restoreFromConfig(observers, store.state.config);
    this.action.init();
    eventListener.bind();
    startService(this, authorizeKey);
    this.win.createWindow("contrast");
    this.shortcut.init();
    this.tray.init();
    recognizer.setUp();
  }

  keys() {
    return Array.from(this.action.actions.keys());
  }

  onExit() {
    this.config.save(env.configPath);
    this.shortcut.unregister();
    app.exit();
  }

  postSet(identifier: Identifier, value: any): boolean {
    return true;
  }

  getT() {
    let locale = this.get<Language>("localeSetting");
    return this.l10n.getT(locale);
  }

  resotreDefaultSetting() {
    this.config.restoreDefault(env.configPath);
    this.restoreFromConfig();
  }

  restoreFromConfig() {
    restoreFromConfig(observers, store.state.config);
  }
}

export { Controller };
