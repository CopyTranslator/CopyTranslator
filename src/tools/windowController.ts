import { BrowserWindow } from "electron";
const ioHook = require("iohook");
const ipc = require("electron").ipcMain;
import { MessageType, WinOpt } from "./enums";

class WindowController {
  x: number = 0;
  y: number = 0;
  isFollow: boolean = false;
  currentWindow: BrowserWindow | undefined = undefined;

  bind() {
    ipc.on(MessageType.WindowOpt.toString(), (event: any, args: any) => {
      var arg = args.args;
      switch (args.type) {
        case WinOpt.Drag:
          this.currentWindow = BrowserWindow.fromWebContents(event.sender);
          this.isFollow = arg.status;
          this.x = arg.x;
          this.y = arg.y;
          break;
        case WinOpt.Minify:
          BrowserWindow.fromWebContents(event.sender).minimize();
          break;
        case WinOpt.Resize:
          var currentWindow = BrowserWindow.fromWebContents(event.sender);
          var bounds = currentWindow.getBounds();
          if (arg.w) bounds.width = arg.w;
          if (arg.h) bounds.height = arg.h;
          currentWindow.setBounds(bounds);
      }
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
