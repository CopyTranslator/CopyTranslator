import { dialog, BrowserWindow, ipcMain, IpcMainEvent } from "electron";
import { autoUpdater } from "electron-updater";
import { icon } from "../../common/env";
import { Controller } from "@/main/controller";

autoUpdater.autoDownload = false;

export class UpdateChecker {
  controller: Controller;
  constructor(controller: Controller) {
    this.controller = controller;
  }

  async check() {
    autoUpdater.checkForUpdates();
  }

  getWindow() {
    return this.controller.win.get("update");
  }

  bindUpdateEvents() {
    autoUpdater.on("error", (error: Error) => {
      console.log(error);
    });

    autoUpdater.on("update-available", updateInfo => {
      const window = this.getWindow();
      window.webContents.on("did-finish-load", () => {
        window.webContents.send("releaseNote", updateInfo);
      });
    });

    autoUpdater.on("update-downloaded", () => {
      dialog
        .showMessageBox({
          type: "info",
          title: "安装更新",
          icon: icon,
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

    ipcMain.on("confirm-update", (event: IpcMainEvent, args: any) => {
      autoUpdater.downloadUpdate();
      this.getWindow().close();
    });
  }
}
