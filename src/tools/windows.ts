import { BrowserWindow } from "electron";
import { createProtocol } from "vue-cli-plugin-electron-builder/lib";

class WindowWrapper {
  window: BrowserWindow | undefined = undefined;
  constructor() {}
  sendMsg(type: string, msg: any) {
    if (this.window) this.window.webContents.send(type, msg);
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

    this.window.on("closed", () => {
      this.window = undefined;
    });
  }
}

export { WindowWrapper };
