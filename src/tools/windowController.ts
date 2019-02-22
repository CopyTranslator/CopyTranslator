import { BrowserWindow, ipcMain as ipc } from "electron";
const ioHook = require("iohook");
import { MessageType, WinOpt } from "./enums";
import { RuleName } from "./rule";

import robot from "robotjs";
function simulateCopy() {
  robot.keyTap("c", "control");
  robot.keyTap("C", "control");
}

class WindowController {
  x: number = 0;
  y: number = 0;
  isFollow: boolean = false;
  currentWindow: BrowserWindow | undefined = undefined;
  ctrlKey = false;
  drag = false;
  lastDown = Date.now();
  lastX = 0;
  lastY = 0;

  bind() {
    ipc.on(MessageType.WindowOpt.toString(), (event: any, args: any) => {
      var arg = args.args;
      var currentWindow = BrowserWindow.fromWebContents(event.sender);
      switch (args.type) {
        case WinOpt.Drag:
          this.currentWindow = currentWindow;
          this.isFollow = arg.status;
          this.x = arg.x;
          this.y = arg.y;
          break;
        case WinOpt.Minify:
          BrowserWindow.fromWebContents(event.sender).minimize();
          break;
        case WinOpt.Resize:
          var bounds = currentWindow.getBounds();
          if (arg.w) bounds.width = arg.w;
          if (arg.h) bounds.height = arg.h;
          if (arg.x) bounds.x = arg.x;
          if (arg.y) bounds.y = arg.y;
          currentWindow.setBounds(bounds);
      }
    });
    ioHook.on("keydown", (event: any) => {
      this.ctrlKey = event.ctrlKey;
    });
    ioHook.on("keyup", (event: any) => {
      if (event.keycode == 29) {
        this.ctrlKey = false;
      } else {
        this.ctrlKey = event.ctrlKey;
      }
    });
    ioHook.on("mousewheel", (event: any) => {
      if (!this.ctrlKey) return;
      var window = BrowserWindow.getFocusedWindow();
      if (window)
        window.webContents.send(MessageType.WindowOpt.toString(), {
          type: WinOpt.Zoom,
          rotation: event.rotation
        });
    });
    ioHook.on("mouseup", (event: MouseEvent) => {
      this.isFollow = false;
      this.currentWindow = undefined;
      var controller = (<any>global).controller;
      if (controller.get(RuleName.autoHide)) {
        controller.focusWin.blur();
      }
      if (
        Date.now() - this.lastDown > 300 &&
        Math.abs(event.x - this.lastX) < 4 &&
        Math.abs(event.y - this.lastY) < 4
      ) {
        console.log("tryed");
        simulateCopy();
      }
    });
    ioHook.on("mousedown", (event: MouseEvent) => {
      this.lastDown = Date.now();
      this.lastX = event.x;
      this.lastY = event.y;
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
      this.drag = true;
    });
    //注册的指令。send到主进程main.js中。
    // Register and start hook
    ioHook.start(false);
  }
}

let windowController = new WindowController();
export { windowController };
