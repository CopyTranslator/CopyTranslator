import { loadStyles } from "../style";
import {
  RouteActionType,
  routeActionTypes,
  HideDirection,
} from "../../common/types";
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

  edgeHide(hideDirection: HideDirection) {
    const window = this.get("contrast");
    const bounds = window.getBounds();
    let { x, y, width, height } = bounds;
    const { x: xBound, width: screenWidth } = screen.getDisplayMatching(
      bounds
    ).bounds;
    let xEnd = x + width;
    let yEnd = y + height;
    switch (hideDirection) {
      case "Up":
        if (yEnd > 10) {
          y -= yEnd - 10;
          yEnd -= yEnd - 10;
          window.setBounds({ x: x, y: y, width: width, height: height });
        }
        break;
      case "Left":
        if (xEnd > xBound + 10) {
          x -= xEnd - (xBound + 10);
          xEnd -= xEnd - (xBound + 10);
          window.setBounds({ x: x, y: y, width: width, height: height });
        }
        break;
      case "Right":
        if (x < xBound + screenWidth - 10) {
          x += xBound + screenWidth - 10 - x;
          window.setBounds({ x: x, y: y, width: width, height: height });
        }
        break;
      case "Minify":
        window.minimize();
        break;
    }
  }

  edgeShow() {
    const window = this.get("contrast");
    const bounds = window.getBounds();
    let { x, y, width, height } = bounds;
    const { x: xBound, width: screenWidth } = screen.getDisplayMatching(
      bounds
    ).bounds;
    let xEnd = x + width;
    let yEnd = y + height;
    if (x < xBound) {
      const val = xBound - x;
      x += val;
      xEnd += val;
    }

    if (xEnd > xBound + screenWidth) {
      const val = xEnd - (xBound + screenWidth);
      x -= val;
      xEnd -= val;
    }

    if (y < 0) {
      yEnd = y;
      y = 0;
    }
    window.setBounds({ x: x, y: y, width: width, height: height });
  }

  onEdge(): HideDirection {
    const window = this.get("contrast");
    if (!this.controller.get("autoHide")) {
      return "None";
    }
    let bound = window.getBounds();
    let { x, y, width } = bound;
    const { x: xBound, width: screenWidth } = screen.getDisplayMatching(
      bound
    ).bounds;
    x -= xBound;
    let xEnd = x + width;

    if (x <= 0) return "Left";
    if (xEnd >= screenWidth) {
      return "Right";
    }
    if (y <= 0) return "Up";
    return "None";
  }

  showWindow() {
    const window = this.get("contrast");
    if (window.isMinimized()) {
      window.restore();
    }
    window.moveTop();
    window.focus();
  }

  hideWindow() {
    const window = this.get("contrast");
    window.hide();
    // window.moveTop();
  }

  setStayTop(val: boolean) {
    this.get("contrast").setAlwaysOnTop(val);
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
      ...param,
    };
    const window = new BrowserWindow(config);
    if (!config.show) {
      window.webContents.once("did-finish-load", () => {
        window.show();
      });
    }
    loadRoute(window, routeName, true);
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
      title: "CopyTranslator",
    };
    const window = this.createWindow("contrast", config, true);
    window.on("blur", () => {
      this.edgeHide(this.onEdge());
    });
    window.on("focus", () => {
      this.edgeShow();
    });
    return window;
  }

  getDisplay() {
    return screen.getDisplayNearestPoint(screen.getCursorScreenPoint());
  }

  createSetting() {
    const width = 320;
    const height = 680;
    const {
      x: xBound,
      y: yBound,
      width: screenWidth,
      height: screenHeight,
    } = this.getDisplay().bounds;

    const t = store.getters.locale;
    const config = {
      x: xBound + (screenWidth - width) / 2,
      y: yBound + (screenHeight - height) / 2,
      width: width,
      height: height,
      maximizable: false,
      minimizable: false,
      title: t["settings"],
    };
    return this.createWindow("settings", config);
  }

  createUpdate() {
    const width = 500,
      height = 500;

    const {
      x: xBound,
      y: yBound,
      width: screenWidth,
      height: screenHeight,
    } = this.getDisplay().bounds;

    const config = {
      x: xBound + (screenWidth - width) / 2,
      y: yBound + (screenHeight - height) / 2,
      width: width,
      height: height,
      maximizable: false,
      minimizable: false,
      parent: this.get("contrast"),
      title: "Update",
    };
    return this.createWindow("update", config);
  }
}
