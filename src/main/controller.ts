import { Window } from "../tools/views/windows";
import { windowController } from "../tools/windowController";
import { TrayManager } from "../tools/tray";
import { recognizer } from "../tools/ocr";
import { Identifier, authorizeKey } from "../tools/types";
import { startService } from "./service";
import { initConfig } from "../tools/configuration";
import { ShortcutManager } from "./shortcut";
import { app } from "electron";
import { env } from "../tools/env";

class Controller {
  win: Window = new Window();
  tray: TrayManager = new TrayManager();
  shortcut: ShortcutManager = new ShortcutManager();
  config = initConfig();

  constructor() {
    this.config.load(env.configPath);
  }

  createWindow() {
    this.shortcut.init();
    this.tray.init();
    this.win.createWindow("contrast");
    windowController.bind();
    recognizer.setUp();
    startService(this, authorizeKey);
  }

  onExit() {
    this.config.save(env.configPath);
    this.shortcut.unregister();
    app.exit();
  }

  postSet(identifier: Identifier, value: any) {}
}

export { Controller };
