import { loadStyles } from "../style";
import {
  RouteActionType,
  routeActionTypes,
  HideDirection,
  Identifier,
  LayoutType,
} from "../../common/types";
import createProtocol from "./create-protocol";
import { BrowserWindow, screen, nativeImage, app } from "electron";
import { env, icon } from "../../common/env";
import store from "../../store";
import { MainController } from "@/common/controller";
import { defaultConfig, MinimalParam, loadRoute, insertStyles } from "./utils";
import config from "@/common/configuration";
import eventBus from "@/common/event-bus";
const forceFocus = require("@adeperio/forcefocus");

export class WindowMangaer {
  windows = new Map<RouteActionType, BrowserWindow>();
  controller: MainController;

  constructor(controller: MainController) {
    this.controller = controller;
    eventBus.gon("preSet", (identifier: Identifier, newLayoutType: any) => {
      if (identifier == "layoutType") {
        this.updateBounds(newLayoutType);
      }
    });
  }

  updateBounds(newLayoutType: LayoutType | null = null) {
    const oldLayoutType = config.get("layoutType");

    let windowConfig = config.get(oldLayoutType);
    const window = this.get("contrast");
    config.set(oldLayoutType, {
      ...windowConfig,
      ...window.getBounds(),
    });
    if (newLayoutType != null) {
      window.setBounds(config.get(newLayoutType));
    }
  }

  get(routeName: RouteActionType): BrowserWindow {
    if (this.windows.has(routeName)) {
      return this.windows.get(routeName) as BrowserWindow;
    } else {
      return this.create(routeName);
    }
  }

  close() {
    this.updateBounds();
    this.get("contrast").close();
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
    window.show();
    window.moveTop();
    //https://github.com/electron/electron/issues/2867
    //https://www.npmjs.com/package/@adeperio/forcefocus

    forceFocus.focusWindow(window);
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
      console.time("create-window");
      window.webContents.once("did-finish-load", () => {
        console.timeEnd("create-window");
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
          window.hide();
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
    let window_config = {
      x: 535,
      y: 186,
      height: 600,
      width: 1094,
      show: false,
      frame: false,
      title: "CopyTranslator",
    };
    const previous_config = config.get(config.get("layoutType"));
    window_config = { ...window_config, ...previous_config };
    const window = this.createWindow("contrast", window_config, true);
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
    const cfg = {
      x: xBound + (screenWidth - width) / 2,
      y: yBound + (screenHeight - height) / 2,
      width: width,
      height: height,
      maximizable: false,
      minimizable: false,
      title: t["settings"],
      parent: this.get("contrast"),
    };
    const previous_cfg = config.get("settings");
    cfg["width"] = previous_cfg["width"];
    cfg["height"] = previous_cfg["height"];
    return this.createWindow("settings", cfg);
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
