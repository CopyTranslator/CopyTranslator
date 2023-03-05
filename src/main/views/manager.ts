import { loadStyles } from "../style";
import {
  RouteActionType,
  HideDirection,
  Identifier,
  LayoutType,
} from "../../common/types";
import { BrowserWindow, screen, nativeImage, app } from "electron";
import store from "../../store";
import { MainController } from "@/common/controller";
import { defaultConfig, MinimalParam, loadRoute, insertStyles } from "./utils";
import config from "@/common/configuration";
import eventBus from "@/common/event-bus";
import { LayoutConfig } from "@/common/rule";
import bus from "@/common/event-bus";
import os from "os";

const forceFocus =
  os.platform() == "win32" ? require("@adeperio/forcefocus") : null;

import qs from "qs";

class IntervalSaver {
  //以一定间隔进行
  func: Function;
  lastSave: number = 0;
  interval: number;
  constructor(func: Function, interval: number = 1000) {
    this.func = func;
    this.interval = interval;
  }

  call() {
    const now = Date.now();
    if (this.lastSave > now) {
      //就说明我们不需要唤起一次新的同步
    } else {
      const interval = this.interval; //修改后预定一次保存，在此保存之前的所有修改都不会再预定保存
      this.lastSave = now + interval;
      setTimeout(() => {
        this.realCall();
      }, interval);
    }
  }

  realCall() {
    const now = Date.now();
    if (now > this.lastSave) {
      this.lastSave = now;
    }
    this.func();
  }
}

export class WindowManager {
  windows = new Map<RouteActionType, BrowserWindow>();
  controller: MainController;
  saver = new IntervalSaver(() => {
    this.saveBounds();
  });

  postStartCallbacks: Function[] = [];
  started: boolean = false;

  //有一些函数需要在窗口创建之后才执行
  registerPostStart(func: Function) {
    if (this.started) {
      func();
    } else {
      this.postStartCallbacks.push(func);
    }
  }

  constructor(controller: MainController) {
    this.controller = controller;
    eventBus.gon("preSet", (identifier: Identifier, newLayoutType: any) => {
      if (identifier == "layoutType") {
        this.saveBounds(); //在切换布局的时候保存窗口信息
      }
    });
  }

  get mainWindow() {
    return this.get("contrast");
  }

  setIgnoreMouseEvents(value: boolean) {
    if (!this.hasMain) {
      return;
    }
    if (value) {
      this.mainWindow.setIgnoreMouseEvents(true, { forward: true });
    } else {
      this.mainWindow.setIgnoreMouseEvents(false);
    }
  }

  get hasMain() {
    return this.windows.has("contrast");
  }

  saveBounds() {
    if (!this.hasMain) {
      return;
    }
    const oldLayoutType = config.get<LayoutType>("layoutType");
    let windowConfig = config.get<LayoutConfig>(oldLayoutType);
    const window = this.mainWindow;
    config.set(oldLayoutType, {
      ...windowConfig,
      ...window.getBounds(),
    });
  }

  syncBounds() {
    if (!this.hasMain) {
      return;
    }
    const layoutType = config.get<LayoutType>("layoutType");
    let windowConfig = config.get<LayoutConfig>(layoutType);
    this.mainWindow.setBounds(windowConfig);
  }

  get(routeName: RouteActionType): BrowserWindow {
    if (this.windows.has(routeName)) {
      return this.windows.get(routeName) as BrowserWindow;
    } else {
      return this.create(routeName);
    }
  }

  showSettings(tab: string | null) {
    if (this.windows.has("settings")) {
      this.get("settings").show();
      if (tab != null) {
        bus.iat("setSettingTab", tab);
      }
    } else {
      this.createSetting(tab).show();
    }
  }

  closeByName(routeName: RouteActionType) {
    if (this.windows.has(routeName)) {
      if (routeName == "contrast") {
        this.saveBounds(); //修复直接退出时没有保存布局设置的问题
      }
      (<BrowserWindow>this.windows.get(routeName)).close();
      this.windows.delete(routeName);
    }
  }

  close() {
    this.saveBounds();
    this.mainWindow.close();
    app.quit();
  }

  edgeHide(hideDirection: HideDirection) {
    const window = this.mainWindow;
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
    const window = this.mainWindow;
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
    const window = this.mainWindow;
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
    const window = this.mainWindow;
    if (window.isMinimized()) {
      window.restore();
    }
    window.show();
    window.moveTop();
    if (forceFocus != null) {
      //https://github.com/electron/electron/issues/2867
      //https://www.npmjs.com/package/@adeperio/forcefocus
      forceFocus.focusWindow(window);
    }
  }

  setStayTop(val: boolean) {
    this.windows.forEach((window, key) => {
      window.setAlwaysOnTop(val);
    });
  }

  create(routeName: RouteActionType): BrowserWindow {
    switch (routeName) {
      case "contrast":
        return this.createMain();
      case "settings":
        return this.createSetting();
      default:
        throw routeName;
    }
  }

  createWindow(
    routeName: RouteActionType,
    param: MinimalParam,
    main: boolean,
    queryString: string = ""
  ): BrowserWindow {
    const cfg = {
      ...defaultConfig,
      ...param,
      alwaysOnTop: config.get<boolean>("stayTop"),
    };
    const window = new BrowserWindow(cfg);

    if (!cfg.show) {
      window.webContents.once("did-finish-load", () => {
        window.show();
      });
    }
    loadRoute(window, routeName, true, queryString);
    insertStyles(window);
    if (main) {
      this.started = false;
      window.on("close", (e: any) => {
        const closeAsQuit = this.controller.get("closeAsQuit");
        if (!closeAsQuit) {
          e.preventDefault();
          window.hide();
        }
      });
      window.webContents.once("did-finish-load", (e: any) => {
        this.started = true;
        for (const func of this.postStartCallbacks) {
          func();
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
      transparent: true,
    };
    const previous_config = config.get<LayoutConfig>(config.get("layoutType"));
    window_config = { ...window_config, ...previous_config };
    const window = this.createWindow("contrast", window_config, true);
    window.on("blur", () => {
      this.edgeHide(this.onEdge());
    });
    window.on("focus", () => {
      this.edgeShow();
    });
    window.on("resize", () => {
      this.saver.call();
    });
    window.on("move", () => {
      this.saver.call();
    });
    return window;
  }

  getDisplay() {
    return screen.getDisplayNearestPoint(screen.getCursorScreenPoint());
  }

  createSetting(tab?: string | null) {
    const width = 500;
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
      parent: this.mainWindow,
      frame: false,
    };
    // TODO 这里要保存用户当前的窗口参数
    // const previous_cfg = config.get<LayoutConfig>("settings");
    // cfg["width"] = previous_cfg["width"];
    // cfg["height"] = previous_cfg["height"];
    const queryString = tab ? "?" + qs.stringify({ tab }) : "";
    return this.createWindow("settings", cfg, false, queryString);
  }
}
