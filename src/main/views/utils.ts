import { loadStyles } from "../style";
import { RouteActionType } from "../../common/types";
import createProtocol from "./create-protocol";
import { BrowserWindow } from "electron";
import { env, icon } from "../../common/env";

export function insertStyles(window: BrowserWindow) {
  window.webContents.on("did-finish-load", function () {
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

export interface MinimalParam {
  x: number;
  y: number;
  width: number;
  height: number;
  title: string;
}

export const defaultConfig = {
  autoHideMenuBar: true,
  maximizable: true,
  minimizable: true,
  show: false,
  icon: icon,
  webPreferences: {
    nodeIntegration: true,
  },
};

const windows = new Map<RouteActionType, BrowserWindow>();

export function createWindow(
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
  loadRoute(window, routeName, false);
  insertStyles(window);
  windows.set(routeName, window);
  return window;
}
