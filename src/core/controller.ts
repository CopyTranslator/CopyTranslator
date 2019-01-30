import { Translator, GoogleTranslator } from "../tools/translator";
import { RuleName } from "../tools/rule";
import { initConfig, ConfigParser } from "../tools/configuration";
import { BrowserWindow } from "electron";
import {
  createProtocol,
  installVueDevtools
} from "vue-cli-plugin-electron-builder/lib";

const os = require("os");
const path = require("path");
const clipboard = require("electron-clipboard-extended");
const defaultConfigPath = path.join(os.homedir(), "copytranslator.json");
const ioHook = require("iohook");
const ipc = require("electron").ipcMain;
import { MessageType } from "../tools/enums";

class Controller {
  src: string = "";
  result: string = "";
  lastAppend: string = "";
  focusWin: BrowserWindow | null = null;
  translator: Translator = new GoogleTranslator();
  config: ConfigParser;
  dragConfig = {
    isFollow: false,
    x: 0,
    y: 0
  };
  constructor() {
    this.config = initConfig();
    this.config.loadValues(defaultConfigPath);
    this.setWatch(true);
  }
  bindWindowEvent() {
    ipc.on(MessageType.DragWindow.toString(), (event: any, arg: any) => {
      this.dragConfig.isFollow = arg.status;
      this.dragConfig.x = arg.x;
      this.dragConfig.y = arg.y;
    });
    ipc.on(MessageType.MinifyWindow.toString(), (event: any, arg: any) => {
      if (this.focusWin) {
        this.focusWin.minimize();
      }
    });
    ioHook.on("mousedown", (event: MouseEvent) => {
      if (this.focusWin) this.focusWin.webContents.send("news", event);
    });
    ioHook.on("mouseup", (event: MouseEvent) => {
      this.dragConfig.isFollow = false;
    });
    ioHook.on("mousedrag", (event: MouseEvent) => {
      if (this.dragConfig.isFollow && this.focusWin && event.button === 0) {
        let x_now = event.x;
        let y_now = event.y;
        let dx = x_now - this.dragConfig.x;
        let dy = y_now - this.dragConfig.y;
        this.dragConfig.x = x_now;
        this.dragConfig.y = y_now;
        let bounds = this.focusWin.getBounds();
        bounds.x += dx;
        bounds.y += dy;
        this.focusWin.setBounds(bounds);
      }
    });
    //注册的指令。send到主进程main.js中。
    // Register and start hook
    ioHook.start(false);
  }
  createWindow() {
    // Create the browser window.
    this.focusWin = new BrowserWindow({
      width: 800,
      height: 600,
      // transparent: true,
      frame: false
    });
    this.focusWin.setAlwaysOnTop(true);

    if (process.env.WEBPACK_DEV_SERVER_URL) {
      // Load the url of the dev server if in development mode
      this.focusWin.loadURL(process.env.WEBPACK_DEV_SERVER_URL);
      if (!process.env.IS_TEST) this.focusWin.webContents.openDevTools();
    } else {
      createProtocol("app");
      // Load the index.html when not in development
      this.focusWin.loadURL("app://./index.html");
    }

    this.focusWin.on("closed", () => {
      this.focusWin = null;
    });
    this.bindWindowEvent();
  }
  checkClipboard() {
    let text = clipboard.readText();
    if (text === this.src || text === this.result) {
      return;
    } else {
      this.doTranslate(text);
    }
  }
  onError(msg: string) {
    (<any>global).logger.error(msg);
  }
  sendMsg(type: string, msg: any) {}
  doTranslate(text: string) {
    this.translator
      .translate(text, "English", "Chinese(Simplified)")
      .then(res => {
        if (res) {
          this.result = res;
          console.log(res);
        } else {
          this.onError("translate error");
        }
      })
      .catch(err => {
        console.error(err);
      });
  }
  setWatch(watch: boolean) {
    if (watch) {
      clipboard.on("text-changed", () => {
        this.checkClipboard();
      });
      clipboard.startWatching();
    } else {
      clipboard.stopWatching();
    }
  }
}
export { Controller };
