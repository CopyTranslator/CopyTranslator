import {
  BrowserWindow,
  Rectangle,
  screen,
  nativeImage,
  ipcMain
} from "electron";
import { ModeConfig } from "../rule";
import { env } from "../env";
import { loadRoute, insertStyles } from ".";
import { RouteActionType } from "../types";
import dayjs from "dayjs";
export class Window {
  window: BrowserWindow | undefined = undefined;
  stored: RouteActionType = "contrast";

  load(routerName: RouteActionType = "contrast") {
    if (!this.window) {
      return;
    }
    loadRoute(this.window, routerName, true);
  }

  createWindow(routeName: RouteActionType) {
    let param: ModeConfig | undefined;
    const controller = global.controller;
    param = {
      x: 535,
      y: 186,
      height: 600,
      width: 1094,
      fontSize: 15
    };
    if (!param) {
      throw Error("not implement window type");
    }

    // Create the browser window.
    this.window = new BrowserWindow({
      x: param.x,
      y: param.y,
      autoHideMenuBar: true,
      width: param.width,
      height: param.height,
      icon: nativeImage.createFromPath(env.iconPath),
      webPreferences: {
        nodeIntegration: true
      },
      show: false
    });
    const now = dayjs();
    ipcMain.on("what are", () => {
      console.log("START", dayjs().diff(now, "ms"));
    });
    this.window.webContents.on("did-finish-load", () => {
      (this.window as any).show();
      console.log(dayjs().diff(now, "ms"));
    });
    this.load(routeName);
    console.log("START2", dayjs().diff(now, "ms"));
    this.window.on("close", e => {
      const closeAsQuit = true;
      if (!closeAsQuit) {
        e.preventDefault();
        if (this.window) {
          this.window.minimize();
        }
      }
    });
    this.window.on("closed", () => {
      this.window = undefined;
    });
  }
}
