import {Tray, Menu} from "electron";
import {envConfig} from "./envConfig";

class TrayManager {
    tray: Tray | undefined;

    constructor() {
    }

    init() {
        this.tray = new Tray(envConfig.diffConfig.iconPath);
        this.tray.setToolTip("CopyTranslator");
        this.tray.on("right-click", event => {
            (<any>global).controller.action.popup("Tray");
        });
    }
}

export {TrayManager};
