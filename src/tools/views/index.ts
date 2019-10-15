import {
  BrowserWindow,
  Rectangle,
  screen,
  nativeImage,
  remote
} from "electron";
import { createProtocol } from "vue-cli-plugin-electron-builder/lib";
import { env } from "../env";
import { RouteName } from "../action";
import { Controller } from "../../core/controller";
import { loadStyles } from "../style";

export function insertStyles(window: BrowserWindow) {
  window.webContents.on("did-finish-load", function() {
    window.webContents.insertCSS(loadStyles());
  });
}

export function loadRoute(
  window: BrowserWindow,
  routeName: RouteName,
  main: boolean = false
) {
  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    window.loadURL(env.publicUrl + `/#/${routeName}`);
    if (!process.env.IS_TEST && main) window.webContents.openDevTools();
  } else {
    // Load the index.html when not in development
    if (main) {
      createProtocol("app");
    }
    const url = `${env.publicUrl}/index.html#${routeName}`;
    window.loadURL(url);
  }
}

export function showSettings() {
  const width = 320,
    height = 640;
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
    autoHideMenuBar: true,
    maximizable: false,
    minimizable: false,
    title: t("settings"),
    parent: current_win.window,
    show: true,
    icon: nativeImage.createFromPath(env.iconPath),
    webPreferences: {
      nodeIntegration: true
    }
  });
  loadRoute(window, "Settings");
  insertStyles(window);
}
