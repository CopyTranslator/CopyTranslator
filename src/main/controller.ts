import { Window } from "../tools/views/windows";
import { windowController } from "../tools/windowController";
import { TrayManager } from "../tools/tray";
import { recognizer } from "../tools/ocr";
import { Identifier, authorizeKey } from "../tools/types";
import { startService } from "../proxy/service";
import { initConfig } from "../tools/configuration";
import { ShortcutManager } from "./shortcut";
import { app } from "electron";
import { env } from "../tools/env";
import { observers } from "../store";
import { Compound, TranslatorType } from "../tools/translate";
import { Polymer } from "../tools/dictionary/polymer";

class Controller {
  win: Window = new Window();
  tray: TrayManager = new TrayManager();
  shortcut: ShortcutManager = new ShortcutManager();
  config = initConfig();
  translator: Compound = new Compound("google", {});
  dictionary: Polymer = new Polymer("google");

  constructor() {
    observers.push(this);
    this.config.load(env.configPath);
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
    console.log("main", identifier, value);
    return true;
  }
}

export { Controller };
