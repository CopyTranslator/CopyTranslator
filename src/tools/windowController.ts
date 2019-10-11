import { BrowserWindow, ipcMain as ipc, screen } from "electron";
import { MessageType, WinOpt } from "./enums";
import { RuleName } from "./rule";
import { Controller } from "../core/controller";
const ioHook = require("iohook");
import simulate from "./simulate";

class WindowController {
  ctrlKey = false;
  drag = false;
  dragCopy = false;
  lastDown = Date.now();
  lastX = 0;
  lastY = 0;
  newY = 0;
  newX = 0;
  copied: boolean = false;

  bind() {
    ipc.on(MessageType.WindowOpt.toString(), (event: any, args: any) => {
      var arg = args.args;
      var currentWindow = BrowserWindow.fromWebContents(event.sender);
      const controller = <Controller>(<any>global).controller;
      const { x, y } = screen.getCursorScreenPoint();
      switch (args.type) {
        case WinOpt.CloseMe:
          currentWindow.close();
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

    //字体缩放
    ioHook.on("mousewheel", (event: any) => {
      if (!this.ctrlKey) return;
      const window = BrowserWindow.getFocusedWindow();
      if (window)
        window.webContents.send(MessageType.WindowOpt.toString(), {
          type: WinOpt.Zoom,
          rotation: event.rotation
        });
    });
    ioHook.on("mouseup", (event: MouseEvent) => {
      //模拟点按复制
      // this.copied = false;
      if (
        this.dragCopy &&
        !this.copied &&
        Date.now() - this.lastDown > 100 &&
        Math.abs(this.newX - this.lastX) + Math.abs(this.newY - this.lastY) > 10
      ) {
        simulate.copy();
        this.copied = true;
      }
    });

    ioHook.on("mousedown", (event: MouseEvent) => {
      this.lastDown = Date.now();
      this.lastX = event.x;
      this.lastY = event.y;
      this.copied = false;
    });

    ioHook.on("mousedrag", (event: MouseEvent) => {
      this.drag = true;
      this.newX = event.x;
      this.newY = event.y;
    });
    //注册的指令。send到主进程main.js中。
    // Register and start hook
    ioHook.start(false);
  }
}

let windowController = new WindowController();
export { windowController };
