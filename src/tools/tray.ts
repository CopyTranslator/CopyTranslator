import { Tray, Menu } from "electron";
import { env } from "./env";
import { constants } from "../core/constant";
import { Controller } from "../core/controller";

class TrayManager {
  tray: Tray | undefined;
  constructor() {}
  init() {
    this.tray = this.tray ? this.tray : new Tray(env.trayIconPath);
    this.tray.setToolTip(constants.appName);
    this.tray.on("right-click", event => {
      global.controller.action.popup("tray");
    });
    this.tray.on("click", event => {
      global.controller.win.show();
    });
  }
}

export { TrayManager };
