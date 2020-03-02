import { BrowserWindow, ipcMain as ipc } from "electron";
import { MessageType, WinOpt } from "./enums";
// import { checkNotice } from "./checker";
// import { checkForUpdates } from "./views/update";

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
    ipc.once(MessageType.FirstLoaded.toString(), (event: any, args: any) => {
      // checkForUpdates();
      // checkNotice();
    });

    ipc.on(MessageType.WindowOpt.toString(), (event: any, args: any) => {
      var arg = args.args;
      var currentWindow = BrowserWindow.fromWebContents(event.sender);
      const controller = global.controller;
      switch (args.type) {
        case WinOpt.CloseMe:
          currentWindow.close();
          break;
        case WinOpt.Minify:
          controller.win.edgeHide(controller.get("hideDirect"));
          break;
      }
    });
  }
}

export const windowController = new WindowController();
