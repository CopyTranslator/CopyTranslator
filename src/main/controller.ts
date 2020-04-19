import { Window } from "./views/windows";
import { eventListener } from "./event-listener";
import { MenuManager } from "./menu-manager";
import { recognizer } from "../common/ocr";
import { Identifier, authorizeKey } from "../common/types";
import { startService } from "../proxy/main";
import { ShortcutManager } from "./shortcut";
import { app, BrowserWindow } from "electron";
import { env } from "../common/env";
import store, { observers, restoreFromConfig } from "../store";
import { TranslateController } from "./translate-controller";
import { l10n, L10N } from "./l10n";
import actionLinks, { showDragCopyWarning } from "./views/dialog";
import { showSettings } from "./views";
import { resetAllConfig } from "./file-related";
import { MainController } from "../common/controller";

class Controller extends MainController {
  win: Window = new Window();
  menu: MenuManager = new MenuManager(this);
  shortcut: ShortcutManager = new ShortcutManager();
  l10n: L10N = l10n;
  transCon = new TranslateController(this);

  constructor() {
    super();
    this.config.load(env.configPath);
    this.l10n.install(store, this.config.get("localeSetting"));
    observers.push(this);
    observers.push(this.transCon);
    this.bindLinks(actionLinks);
  }

  handle(identifier: Identifier): boolean {
    switch (identifier) {
      case "font+":
        console.log("font+");
        break;
      case "font-":
        console.log("font-");
        break;
      case "exit":
        this.onExit();
        break;
      case "settings":
        showSettings();
        break;
      case "restoreDefault":
        this.resotreDefaultSetting();
        break;
      default:
        return this.transCon.handle(identifier);
    }

    console.log(identifier);
    return true;
  }

  createWindow() {
    restoreFromConfig(observers, store.state.config);
    eventListener.bind();
    startService(this, authorizeKey);
    this.win.createWindow("contrast");
    this.shortcut.init();
    this.menu.init();
    recognizer.setUp();
  }

  onExit() {
    this.config.save(env.configPath);
    this.shortcut.unregister();
    app.exit();
  }

  postSet(identifier: Identifier, value: any): boolean {
    switch (identifier) {
      case "localeSetting":
        this.l10n.updateLocale(this.get("localeSetting"));
        break;
      case "dragCopy":
        if (value == true && !this.get("neverShow")) {
          showDragCopyWarning(this);
        }
        break;
      case "colorMode":
        BrowserWindow.getAllWindows().forEach(window => {
          window.reload();
        });
        break;
      default:
        return false;
    }
    return true;
  }

  resotreDefaultSetting() {
    resetAllConfig();
    this.config.restoreDefault(env.configPath);
    this.restoreFromConfig();
  }

  restoreFromConfig() {
    restoreFromConfig(observers, store.state.config);
  }
}

export { Controller };
