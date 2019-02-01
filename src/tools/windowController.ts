import { BrowserWindow } from "electron";
const ioHook = require("iohook");
const ipc = require("electron").ipcMain;
import { MessageType } from "./enums";

class WindowController {
  x: number = 0;
  y: number = 0;
  isFollow: boolean = false;
  currentWindow: BrowserWindow | undefined = undefined;
  bind() {
    ipc.on(MessageType.DragWindow.toString(), (event: any, arg: any) => {
      this.currentWindow = BrowserWindow.fromWebContents(event.sender);
      this.isFollow = arg.status;
      this.x = arg.x;
      this.y = arg.y;
    });
    ipc.on(MessageType.MinifyWindow.toString(), (event: any, arg: any) => {
      BrowserWindow.fromWebContents(event.sender).minimize();
    });
    ioHook.on("mouseup", (event: MouseEvent) => {
      this.isFollow = false;
      this.currentWindow = undefined;
    });
    ioHook.on("mousedrag", (event: MouseEvent) => {
      if (this.isFollow && this.currentWindow && event.button === 0) {
        let x_now = event.x;
        let y_now = event.y;
        let dx = x_now - this.x;
        let dy = y_now - this.y;
        this.x = x_now;
        this.y = y_now;
        let bounds = this.currentWindow.getBounds();
        bounds.x += dx;
        bounds.y += dy;
        this.currentWindow.setBounds(bounds);
      }
    });
    //注册的指令。send到主进程main.js中。
    // Register and start hook
    ioHook.start(false);
  }
}

let windowController = new WindowController();
export { windowController };
