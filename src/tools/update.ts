import { dialog, BrowserWindow, screen, nativeImage, ipcMain } from "electron";
import { autoUpdater } from "electron-updater";
import { Controller } from "../core/controller";
import { envConfig } from "./envConfig";
import { checkUpdate } from "./checker";

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
    const current_win = (<Controller>(<any>global).controller).win;
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
      titleBarStyle: "hiddenInset",
      maximizable: false,
      title: "软件更新",
      parent: current_win.window,
      icon: nativeImage.createFromPath(envConfig.iconPath)
    });
    if (process.env.WEBPACK_DEV_SERVER_URL) {
      // Load the url of the dev server if in development mode
      window.loadURL(envConfig.publicUrl + `/#/Update`);
    } else {
      // Load the index.html when not in development
      window.loadURL(`${envConfig.publicUrl}/index.html#Update`);
    }
    ipcMain.on("releaseNote", (event: any, args: any) => {
      (<BrowserWindow>window).webContents.send("releaseNote", updateInfo);
    });
  });

  autoUpdater.on("update-downloaded", () => {
    dialog.showMessageBox(
      {
        type: "info",
        title: "安装更新",
        icon: nativeImage.createFromPath(envConfig.iconPath),
        message: "更新已下载",
        buttons: ["现在退出并安装", "退出后自动安装", "cancel"],
        cancelId: 2
      },
      (response, checkboxChecked) => {
        if (response == 0) {
          setImmediate(() => autoUpdater.quitAndInstall());
        }
        if (response == 1) {
          autoUpdater.autoInstallOnAppQuit = true;
        }
      }
    );
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
