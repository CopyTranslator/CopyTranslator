import { Tray, Menu } from "electron";
import { envConfig } from "./envConfig";
import { constants } from "../core/constant";
import { Controller } from "../core/controller";
import { RouteName } from "./action";

class TrayManager {
  tray: Tray | undefined;
  constructor() {}
  init() {
    this.tray = this.tray ? this.tray : new Tray(envConfig.trayIconPath);
    this.tray.setToolTip(constants.appName);
    this.tray.on("right-click", event => {
      (<Controller>(<any>global).controller).action.popup(RouteName.Tray);
    });
  }
}

export { TrayManager };
