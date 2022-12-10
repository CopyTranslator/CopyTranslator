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
  main: boolean,
  queryString: string
) {
  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    const url = env.publicUrl + `/#/${routeName}${queryString}`;
    console.log(url);
    window.loadURL(url);

    if (!process.env.IS_TEST && main) window.webContents.openDevTools();
  } else {
    // Load the index.html when not in development
    if (main) {
      createProtocol("app");
    }
    const url = `${env.publicUrl}/index.html#${routeName}${queryString}`;
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
    webSecurity: false,
  },
};
