import { BrowserWindow, screen, nativeImage } from "electron";
import createProtocol from "./create-protocol";
import { env } from "../env";
import { loadStyles } from "../style";
import { RouteActionType } from "../types";
import store from "../../store";
export * from "./dialog";

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
  const width = 320;
  const height = 680;
  const {
    x: xBound,
    x: yBound,
    width: screenWidth,
    height: screenHeight
  } = screen.getPrimaryDisplay().bounds;
  const t = store.getters.locale;
  const window = new BrowserWindow({
    x: xBound + (screenWidth - width) / 2,
    y: yBound + (screenHeight - height) / 2,
    width: width,
    height: height,
    autoHideMenuBar: true,
    maximizable: false,
    minimizable: false,
    title: t["settings"],
    show: true,
    icon: nativeImage.createFromPath(env.iconPath),
    webPreferences: {
      nodeIntegration: true
    }
  });
  loadRoute(window, "settings", false);
  insertStyles(window);
}
