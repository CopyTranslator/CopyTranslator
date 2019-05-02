import { BrowserWindow, ipcMain as ipc, screen } from "electron";
import { MessageType, WinOpt } from "./enums";
import { RuleName } from "./rule";
import { Controller } from "../core/controller";
const ioHook = require("iohook");
const robot = require("robotjs");

function simulateCopy() {
  robot.keyTap("C", "control");
}

function simulatePaste() {
  robot.keyTap("V", "control");
}

class WindowController {
  xV1: number = 0;
  yV1: number = 0;
  isFollowV1: boolean = false;
  currentWindowV1: BrowserWindow | undefined = undefined;

  xV3: number = 0;
  yV3: number = 0;
  isFollowV3: boolean = false;
  currentWindowV3: BrowserWindow | undefined = undefined;

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
      const { x, y } = screen.getCursorScreenPoint();
      switch (args.type) {
        case WinOpt.Drag:
          this.currentWindowV1 = currentWindow;
          this.isFollowV1 = arg.status;
          this.xV1 = arg.x;
          this.yV1 = arg.y;
          break;
        case WinOpt.StartDrag:
          this.isFollowV3 = true;
          this.xV3 = x;
          this.yV3 = y;
          this.currentWindowV3 = currentWindow;
          break;
        case WinOpt.Dragging:
          if (this.isFollowV3 && this.currentWindowV3) {
            let dx = x - this.xV3;
            let dy = y - this.yV3;
            this.xV3 = x;
            this.yV3 = y;
            let bounds = this.currentWindowV3.getBounds();
            bounds.x += dx;
            bounds.y += dy;
            this.currentWindowV3.setBounds(bounds);
          }
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
      //取消鼠标拖拽跟踪
      if (this.currentWindowV3) {
        this.currentWindowV3.webContents.send(
          MessageType.WindowOpt.toString(),
          {
            type: WinOpt.EndDrag
          }
        );
        this.currentWindowV3 = undefined;
      }
      this.isFollowV3 = false;
      this.isFollowV1 = false;
      this.currentWindowV1 = undefined;

      //模拟点按复制
      if (
        this.tapCopy &&
        Date.now() - this.lastDown > 300 &&
        Math.abs(event.x - this.lastX) < 4 &&
        Math.abs(event.y - this.lastY) < 4
      ) {
        simulateCopy();
      }
    });
    ioHook.on("mousedown", (event: MouseEvent) => {
      this.lastDown = Date.now();
      this.lastX = event.x;
      this.lastY = event.y;
    });
    ioHook.on("mousedrag", (event: MouseEvent) => {
      if (this.isFollowV1 && this.currentWindowV1 && event.button === 0) {
        let x_now = event.x;
        let y_now = event.y;
        let dx = x_now - this.xV1;
        let dy = y_now - this.yV1;
        this.xV1 = x_now;
        this.yV1 = y_now;
        let bounds = this.currentWindowV1.getBounds();
        bounds.x += dx;
        bounds.y += dy;
        this.currentWindowV1.setBounds(bounds);
      }
      this.drag = true;
    });
    //注册的指令。send到主进程main.js中。
    // Register and start hook
    ioHook.start(false);
  }
}

let windowController = new WindowController();
export { windowController, simulatePaste };
