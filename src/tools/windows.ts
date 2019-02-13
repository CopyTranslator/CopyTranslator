import { BrowserWindow } from "electron";
import { createProtocol } from "vue-cli-plugin-electron-builder/lib";
import { MessageType } from "./enums";

class WindowWrapper {
  window: BrowserWindow | undefined = undefined;
  stayTop: boolean = false;
  constructor() {}
  sendMsg(type: string, msg: any) {
    if (this.window) this.window.webContents.send(type, msg);
  }
  routeTo(routerName: string) {
    if (this.window) {
      this.window.focus();
      this.window.webContents.send(MessageType.Router.toString(), routerName);
    }
  }
  createWindow() {
    // Create the browser window.
    this.window = new BrowserWindow({
      width: 800,
      height: 600,
      frame: false
    });

    if (process.env.WEBPACK_DEV_SERVER_URL) {
      // Load the url of the dev server if in development mode
      this.window.loadURL(process.env.WEBPACK_DEV_SERVER_URL);
      if (!process.env.IS_TEST) this.window.webContents.openDevTools();
    } else {
      createProtocol("app");
      // Load the index.html when not in development
      this.window.loadURL("app://./index.html");
    }
    try {
      this.window.setAlwaysOnTop(this.stayTop);
    } catch (e) {
      (<any>global).log.debug("set Stay top fail");
    }
    this.window.on("closed", () => {
      this.window = undefined;
    });
  }
}

export { WindowWrapper };
