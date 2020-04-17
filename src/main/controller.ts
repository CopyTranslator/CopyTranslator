import { Window } from "../common/views/windows";
import { eventListener } from "./event-listener";
import { TrayManager } from "../common/tray";
import { recognizer } from "../common/ocr";
import { Identifier, authorizeKey } from "../common/types";
import { startService } from "../proxy/main";
import { ShortcutManager } from "./shortcut";
import { app } from "electron";
import { env } from "../common/env";
import store, { observers, restoreFromConfig } from "../store";
import { TranslateController } from "./translate-controller";
import { l10n, L10N } from "./l10n";
import { ActionManager } from "../common/action";
import { MainController } from "../common/controller";

class Controller extends MainController {
  win: Window = new Window();
  tray: TrayManager = new TrayManager();
  shortcut: ShortcutManager = new ShortcutManager();
  l10n: L10N = l10n;
  transCon = new TranslateController(this);

  constructor() {
    super();
    this.config.load(env.configPath);
    this.l10n.install(store, this.config.get("localeSetting"));
    observers.push(this);
    observers.push(this.transCon);
  }

  handle(identifier: Identifier): boolean {
    console.log("main handle", identifier);
    if (identifier == "font+") {
      return true;
    }
    return false;
  }

  createWindow() {
    restoreFromConfig(observers, store.state.config);
    eventListener.bind();
    startService(this, authorizeKey);
    this.win.createWindow("contrast");
    this.shortcut.init();
    this.tray.init();
    recognizer.setUp();
  }

  onExit() {
    this.config.save(env.configPath);
    this.shortcut.unregister();
    app.exit();
  }

  postSet(identifier: Identifier, value: any): boolean {
    return false;
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
