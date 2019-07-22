import {
  BrowserWindow,
  Rectangle,
  screen,
  nativeImage,
  remote
} from "electron";
import { createProtocol } from "vue-cli-plugin-electron-builder/lib";
import { ColorStatus, HideDirection, MessageType, WinOpt } from "../enums";
import { ModeConfig, RuleName } from "../rule";
import { envConfig } from "../envConfig";
import { RouteName } from "../action";
import { en } from "../locales";
import { Controller } from "../../core/controller";

export function loadRoute(
  window: BrowserWindow,
  routeName: RouteName,
  main: boolean = false
) {
  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    window.loadURL(envConfig.publicUrl + `/#/${routeName}`);
    if (!process.env.IS_TEST && main) window.webContents.openDevTools();
  } else {
    // Load the index.html when not in development
    if (main) {
      createProtocol("app");
    }
    const url = `${envConfig.publicUrl}/index.html#${routeName}`;
    window.loadURL(url);
  }
}

export function showSettings() {
  const width = 260,
    height = 800;
  const controller = <Controller>(<any>global).controller;
  const current_win = controller.win;
  const bound = current_win.getBound();
  const {
    x: xBound,
    x: yBound,
    width: screenWidth,
    height: screenHeight
  } = screen.getDisplayMatching(bound).bounds;
  const t = controller.getT();
  const window = new BrowserWindow({
    x: xBound + (screenWidth - width) / 2,
    y: yBound + (screenHeight - height) / 2,
    width: width,
    height: height,
    titleBarStyle: "hiddenInset",
    maximizable: false,
    minimizable: false,
    title: t("settings"),
    parent: current_win.window,
    show: true,
    modal: true,
    icon: nativeImage.createFromPath(envConfig.iconPath)
  });
  loadRoute(window, RouteName.CustomPanel);
}

export function showAPIConfig() {
  const width = 354,
    height = 510;
  const controller = <Controller>(<any>global).controller;
  const current_win = controller.win;
  const bound = current_win.getBound();
  const {
    x: xBound,
    x: yBound,
    width: screenWidth,
    height: screenHeight
  } = screen.getDisplayMatching(bound).bounds;
  const t = controller.getT();
  const window = new BrowserWindow({
    x: xBound + (screenWidth - width) / 2,
    y: yBound + (screenHeight - height) / 2,
    width: width,
    height: height,
    titleBarStyle: "hiddenInset",
    maximizable: false,
    minimizable: false,
    parent: current_win.window,
    modal: true,
    title: t("ApiConfig"),
    icon: nativeImage.createFromPath(envConfig.iconPath)
  });
  loadRoute(window, RouteName.ApiConfig);
  window.once("ready-to-show", () => {
    window.show();
  });
}
