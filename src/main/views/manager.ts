import { loadStyles } from "../style";
import { RouteActionType, routeActionTypes } from "../../common/types";
import createProtocol from "./create-protocol";
import { BrowserWindow, screen, nativeImage } from "electron";
import { env, icon } from "../../common/env";
import store from "../../store";
import { MainController } from "@/common/controller";
import { defaultConfig, MinimalParam, loadRoute, insertStyles } from "./utils";

export class WindowMangaer {
  windows = new Map<RouteActionType, BrowserWindow>();
  controller: MainController;

  constructor(controller: MainController) {
    this.controller = controller;
  }

  get(routeName: RouteActionType): BrowserWindow {
    if (this.windows.has(routeName)) {
      return this.windows.get(routeName) as BrowserWindow;
    } else {
      return this.create(routeName);
    }
  }

  create(routeName: RouteActionType): BrowserWindow {
    switch (routeName) {
      case "contrast":
        return this.createMain();
      case "settings":
        return this.createSetting();
      case "update":
        return this.createSetting();
    }
  }

  createWindow(
    routeName: RouteActionType,
    param: MinimalParam,
    main: boolean = false
  ): BrowserWindow {
    const config = {
      ...defaultConfig,
      ...param
    };
    const window = new BrowserWindow(config);
    if (!config.show) {
      window.webContents.once("did-finish-load", () => {
        window.show();
      });
    }
    loadRoute(window, routeName, false);
    insertStyles(window);
    if (main) {
      window.on("close", (e: any) => {
        const closeAsQuit = this.controller.get("closeAsQuit");
        if (!closeAsQuit) {
          e.preventDefault();
          window.minimize();
        }
      });
    }
    window.on("closed", () => {
      this.windows.delete(routeName);
    });
    this.windows.set(routeName, window);
    return window;
  }

  createMain() {
    const config = {
      x: 535,
      y: 186,
      height: 600,
      width: 1094,
      show: false,
      title: "CopyTranslator"
    };
    return this.createWindow("contrast", config, true);
  }

  createSetting() {
    const width = 320;
    const height = 680;
    const {
      x: xBound,
      x: yBound,
      width: screenWidth,
      height: screenHeight
    } = screen.getPrimaryDisplay().bounds; //TODO 这里需要对双屏做优化
    const t = store.getters.locale;
    const config = {
      x: xBound + (screenWidth - width) / 2,
      y: yBound + (screenHeight - height) / 2,
      width: width,
      height: height,
      maximizable: false,
      minimizable: false,
      title: t["settings"]
    };
    return this.createWindow("settings", config);
  }

  createUpdate() {
    const width = 500,
      height = 500;

    const {
      x: xBound,
      x: yBound,
      width: screenWidth,
      height: screenHeight
    } = screen.getPrimaryDisplay().bounds; //TODO 这里需要对双屏做优化

    const config = {
      x: xBound + (screenWidth - width) / 2,
      y: yBound + (screenHeight - height) / 2,
      width: width,
      height: height,
      maximizable: false,
      minimizable: false,
      parent: this.get("contrast"),
      title: "Update"
    };
    return this.createWindow("update", config);
  }
}
