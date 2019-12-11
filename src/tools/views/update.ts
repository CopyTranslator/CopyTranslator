import { dialog, BrowserWindow, screen, nativeImage, ipcMain } from "electron";
import { autoUpdater } from "electron-updater";
import { env } from "../env";
import { checkUpdate } from "../checker";
import { loadRoute, insertStyles } from "./index";
let window: BrowserWindow | undefined = undefined;
let binded: boolean = false;
autoUpdater.autoDownload = false;

function bindUpdateEvents() {
  autoUpdater.on("error", (error: Error) => {
    checkUpdate();
  });
  autoUpdater.on("update-available", updateInfo => {
    const width = 500,
      height = 500;
    const current_win = global.controller.win;
    const bound = current_win.getBound();
    const {
      x: xBound,
      x: yBound,
      width: screenWidth,
      height: screenHeight
    } = screen.getDisplayMatching(bound).bounds;
    window = new BrowserWindow({
      x: xBound + (screenWidth - width) / 2,
      y: yBound + (screenHeight - height) / 2,
      width: width,
      height: height,
      autoHideMenuBar: true,
      maximizable: false,
      minimizable: false,
      title: "软件更新",
      parent: current_win.window,
      icon: nativeImage.createFromPath(env.iconPath),
      webPreferences: {
        nodeIntegration: true
      }
    });
    loadRoute(window, "update");
    insertStyles(window);
    window.webContents.on("did-finish-load", function() {
      (<BrowserWindow>window).webContents.send("releaseNote", updateInfo);
    });
  });

  autoUpdater.on("update-downloaded", () => {
    dialog
      .showMessageBox({
        type: "info",
        title: "安装更新",
        icon: nativeImage.createFromPath(env.iconPath),
        message: "更新已下载",
        buttons: ["现在退出并安装", "退出后自动安装", "cancel"],
        cancelId: 2
      })
      .then(res => res.response)
      .then(response => {
        if (response == 0) {
          setImmediate(() => autoUpdater.quitAndInstall());
        }
        if (response == 1) {
          autoUpdater.autoInstallOnAppQuit = true;
        }
      });
  });

  ipcMain.on("confirm-update", (event: any, args: any) => {
    autoUpdater.downloadUpdate();
    (<BrowserWindow>window).close();
    window = undefined;
  });
}

export async function checkForUpdates() {
  if (!binded) {
    bindUpdateEvents();
    binded = true;
  }
  autoUpdater.checkForUpdates();
}
