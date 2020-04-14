import { Tray, Menu, MenuItem } from "electron";
import { env } from "./env";
import { constants } from "../core/constant";
import os from "os";

class TrayManager {
  tray: Tray | undefined;
  constructor() {}
  init() {
    this.tray = this.tray ? this.tray : new Tray(env.trayIconPath);
    this.tray.setToolTip(constants.appName);
  }
}

export { TrayManager };
