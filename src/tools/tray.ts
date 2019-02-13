import { Tray, Menu } from "electron";
import { envConfig } from "./envConfig";

class TrayManager {
  appIcon: Tray | undefined;
  constructor() {}
  init() {
    this.appIcon = new Tray(envConfig.diffConfig.iconPath);
    this.appIcon.setToolTip("CopyTranslator");
    this.appIcon.on("right-click", event => {
      (<any>global).controller.menu.popup("Tray");
    });
  }
}
export { TrayManager };
