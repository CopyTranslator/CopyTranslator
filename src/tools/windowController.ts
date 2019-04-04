import { BrowserWindow, ipcMain as ipc, screen, Display } from "electron";
const ioHook = require("iohook");
import { MessageType, WinOpt } from "./enums";
import { RuleName } from "./rule";
import { Controller } from "@/core/controller";

const robot = require("robotjs");

function simulateCopy() {
  robot.keyTap("C", "control");
}

function simulatePaste() {
  robot.keyTap("V", "control");
}

class WindowController {
  x: number = 0;
  y: number = 0;
  isFollow: boolean = false;
  currentWindow: BrowserWindow | undefined = undefined;
  ctrlKey = false;
  drag = false;
  tapCopy = false;
  lastDown = Date.now();
  lastX = 0;
  lastY = 0;

  bind() {
    ipc.on(MessageType.WindowOpt.toString(), (event: any, args: any) => {
      var arg = args.args;
      var currentWindow = BrowserWindow.fromWebContents(event.sender);
      const controller = <Controller>(<any>global).controller;
      switch (args.type) {
        case WinOpt.Drag:
          this.currentWindow = currentWindow;
          this.isFollow = arg.status;
          this.x = arg.x;
          this.y = arg.y;
          break;
        case WinOpt.Minify:
          controller.win.edgeHide(controller.get(RuleName.hideDirect));
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
      const window = BrowserWindow.getFocusedWindow();
      if (window)
        window.webContents.send(MessageType.WindowOpt.toString(), {
          type: WinOpt.Zoom,
          rotation: event.rotation
        });
    });
    //注册的指令。send到主进程main.js中。
    // Register and start hook
    ioHook.start(false);
  }
}

let windowController = new WindowController();
export { windowController, simulatePaste };
