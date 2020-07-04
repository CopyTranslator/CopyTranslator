import { Tray, Menu, MenuItem } from "electron";
import { env } from "./env";
import { constants } from "../core/constant";
import { Controller } from "../core/controller";

class TrayManager {
  tray: Tray | undefined;
  constructor() {}
  init() {
    this.tray = this.tray ? this.tray : new Tray(env.trayIconPath);
    this.tray.setToolTip(constants.appName);

    if (global.process.platform == "linux") {
      this.tray.on("click", () => {
        // electron 6.1.x 无法探测托盘图标click事件，此事件为tooptip的click时间
        // 经过测试electron 8.x click事件正常，是托盘图标的click事件
        global.controller.action.popup("tray");
      });
      return;
    }

    this.tray.on("right-click", event => {
      global.controller.action.popup("tray");
    });
    this.tray.on("click", event => {
      global.controller.win.show();
    });
  }
}

export { TrayManager };
