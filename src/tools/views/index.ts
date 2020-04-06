import { BrowserWindow, screen, nativeImage } from "electron";
import { createProtocol } from "vue-cli-plugin-electron-builder/lib";
import { env } from "../env";
import { loadStyles } from "../style";
import { RouteActionType } from "../types";

export function insertStyles(window: BrowserWindow) {
  window.webContents.on("did-finish-load", function() {
    window.webContents.insertCSS(loadStyles());
  });
}

export function loadRoute(
  window: BrowserWindow,
  routeName: RouteActionType,
  main: boolean = false
) {
  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    const url = env.publicUrl + `/#/${routeName}`;
    console.log(url);
    window.loadURL(url);
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
    height = 680;
  const controller = global.controller;
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
  loadRoute(window, "settings", true);
  insertStyles(window);
}
