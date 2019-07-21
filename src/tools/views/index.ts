import { BrowserWindow, Rectangle, screen, nativeImage } from "electron";
import { createProtocol } from "vue-cli-plugin-electron-builder/lib";
import { ColorStatus, HideDirection, MessageType, WinOpt } from "../enums";
import { ModeConfig, RuleName } from "../rule";
import { envConfig } from "../envConfig";
import { RouteName } from "../action";
import { en } from "../locales";
import { Controller } from "../../core/controller";

export function loadRoute(window: BrowserWindow, routeName: RouteName) {
  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    window.loadURL(envConfig.publicUrl + `/#/${routeName}`);
  } else {
    // Load the index.html when not in development
    window.loadURL(`${envConfig.publicUrl}/index.html${routeName}`);
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
    title: t("settings"),
    parent: current_win.window,
    icon: nativeImage.createFromPath(envConfig.iconPath)
  });
  loadRoute(window, RouteName.Settings);
}
