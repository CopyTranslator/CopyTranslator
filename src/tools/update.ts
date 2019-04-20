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
    dialog.showErrorBox(
      "Error: ",
      error == null ? "unknown" : (error.stack || error).toString()
    );
  });
  autoUpdater.on("update-available", updateInfo => {
    const width = 500,
      height = 500;
    const bound = (<Controller>(<any>global).controller).win.getBound();
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
      title: "Software Update",
      parent: BrowserWindow.getAllWindows()[0],
      icon: nativeImage.createFromPath(envConfig.iconPath)
    });
    window.loadURL(`${envConfig.publicUrl}/dialog.html`);
    window.webContents.on("did-finish-load", function() {
      (<BrowserWindow>window).webContents.executeJavaScript(
        `document.getElementById("releaseNote").innerHTML="${
          updateInfo.releaseNotes
        }";document.getElementById("version").innerHTML="${
          updateInfo.version
        } ${updateInfo.releaseName}";`
      );
    });
  });

  autoUpdater.on("update-not-available", updateInfo => {
    console.log(updateInfo);
    dialog.showMessageBox({
      type: "info",
      title: "暂无更新",
      message: "当前版本已经是最新",
      icon: nativeImage.createFromPath(envConfig.iconPath)
    });
  });

  autoUpdater.on("update-downloaded", () => {
    dialog.showMessageBox(
      {
        type: "info",
        title: "Install Updates",
        icon: nativeImage.createFromPath(envConfig.iconPath),
        message: "Updates downloaded",
        buttons: ["Quit and Install now", "Install after Quit", "cancel"],
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
  try {
    let t = await autoUpdater.checkForUpdates();
    console.log(t);
  } catch (e) {
    console.log(e);
    checkUpdate();
  }
}
