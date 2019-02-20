import { BrowserWindow, Rectangle } from "electron";
import { createProtocol } from "vue-cli-plugin-electron-builder/lib";
import { MessageType, WinOpt, ColorStatus } from "./enums";
import { ModeConfig } from "./rule";
import { RouteName } from "./action";
import { url } from "inspector";
import { loadStyles } from "./style";

class WindowWrapper {
  window: BrowserWindow | undefined = undefined;
  stayTop: boolean = false;
  stored: string = RouteName.Focus;

  constructor() {}

  sendMsg(type: string, msg: any) {
    if (this.window) this.window.webContents.send(type, msg);
  }

  winOpt(type: WinOpt, args: any) {
    this.sendMsg(MessageType.WindowOpt.toString(), {
      type: type,
      args: args
    });
  }

  switchColor(color: ColorStatus) {
    this.winOpt(WinOpt.ChangeColor, color);
  }

  routeTo(routerName: string) {
    if (this.window) {
      this.window.focus();
      this.window.webContents.send(MessageType.Router.toString(), routerName);
    }
  }

  load(routerName: RouteName = RouteName.Focus) {
    if (!this.window) return;
    if (process.env.WEBPACK_DEV_SERVER_URL) {
      // Load the url of the dev server if in development mode
      this.window.loadURL(
        process.env.WEBPACK_DEV_SERVER_URL + `/#/${routerName}`
      );
      if (!process.env.IS_TEST) this.window.webContents.openDevTools();
    } else {
      createProtocol("app");
      // Load the index.html when not in development
      this.window.loadURL(`file://${__dirname}/index.html#${routerName}`);
    }
    this.window.setAlwaysOnTop(this.stayTop);
    let windowPointer = this.window;
    this.window.webContents.on("did-finish-load", function() {
      windowPointer.webContents.insertCSS(loadStyles());
    });
  }

  createWindow(param: ModeConfig) {
    // Create the browser window.
    this.window = new BrowserWindow({
      x: param.x,
      y: param.y,
      width: param.width,
      height: param.height,
      frame: false
    });
    this.load();
    this.window.on("closed", () => {
      this.window = undefined;
    });
  }

  getBound(): Rectangle {
    if (this.window) {
      return this.window.getBounds();
    } else {
      return {
        x: 100,
        y: 100,
        width: 800,
        height: 600
      };
    }
  }

  restore(param: ModeConfig) {
    if (this.window) {
      this.window.setBounds(Object.assign(this.getBound(), param));
      this.window.setAlwaysOnTop(this.stayTop);
    }
  }
}

export { WindowWrapper };
