import { Window } from "../common/views/windows";
import { windowController } from "../common/windowController";
import { TrayManager } from "../common/tray";
import { recognizer } from "../common/ocr";
import { Identifier, authorizeKey } from "../common/types";
import { startService } from "../proxy/service";
import { initConfig } from "../common/configuration";
import { ShortcutManager } from "./shortcut";
import { app } from "electron";
import { env } from "../common/env";
import store, { observers, restoreFromConfig } from "../store";
import { Compound, TranslatorType } from "../common/translate";
import { Polymer } from "../common/dictionary/polymer";
import bus from "../common/event-bus";

class Controller {
  win: Window = new Window();
  tray: TrayManager = new TrayManager();
  shortcut: ShortcutManager = new ShortcutManager();
  config = initConfig();
  translator: Compound = new Compound("google", {});
  dictionary: Polymer = new Polymer("google");

  constructor() {
    this.config.load(env.configPath);
    restoreFromConfig([this], store.state.config);
    observers.push(this);
  }

  createWindow() {
    this.shortcut.init();
    this.tray.init();
    this.win.createWindow("contrast");
    windowController.bind();
    recognizer.setUp();
    startService(this.translator, `${authorizeKey}-translator`);
    startService(this.dictionary, `${authorizeKey}-dictionary`);
  }

  onExit() {
    this.config.save(env.configPath);
    this.shortcut.unregister();
    app.exit();
  }

  postSet(identifier: Identifier, value: any): boolean {
    return true;
  }
}

export { Controller };
