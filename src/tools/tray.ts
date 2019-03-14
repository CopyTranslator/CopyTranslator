import { Tray, Menu } from "electron";
import { envConfig } from "./envConfig";
import { constants } from "../core/constant";

class TrayManager {
  tray: Tray | undefined;
  constructor() {}
  init() {
    this.tray = new Tray(envConfig.diffConfig.iconPath);
    this.tray.setToolTip(constants.appName);
    this.tray.on("right-click", event => {
      (<any>global).controller.action.popup("Tray");
    });
  }
}

export { TrayManager };
