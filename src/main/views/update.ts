import { dialog, BrowserWindow, ipcMain } from "electron";
import { autoUpdater } from "electron-updater";
import { env, icon, osType } from "@/common/env";
import { Controller } from "@/main/controller";
import path from "path";
import {
  constants,
  getChangelogURL,
  isLower,
  version,
} from "@/common/constant";
import axios_ from "axios";

autoUpdater.autoDownload = false;
type UpdateInfo = {
  releaseName: string;
  releaseNotes: string;
  needCompile: boolean;
  isWin: boolean;
  manualLink: string;
};

export class UpdateChecker {
  controller: Controller;
  win?: BrowserWindow;
  constructor(controller: Controller) {
    this.controller = controller;
    this.bindUpdateEvents();
  }

  async check() {
    console.log("正在检查Github更新");
    autoUpdater.checkForUpdates().catch((e) => {
      console.log("成功捕获异常好吧");
    });
  }

  get(url: string) {
    return axios_.get(url, { timeout: 5000 });
  }

  checkTheGiteePages() {
    console.log("正在检查Gitee更新");
    console.log(constants.latest);
    this.get(constants.latest)
      .then((res) => res.data)
      .then((data) => {
        console.log("Gitee上最新版本为", JSON.stringify(data));
        //这里的data.version是带了前缀v的
        if (isLower(version, data.version)) {
          this.get(getChangelogURL(data.version))
            .then((res) => res.data)
            .then((releaseNotes) => {
              const updateInfo: UpdateInfo = {
                releaseNotes,
                releaseName: data.releaseName,
                needCompile: true,
                isWin: false,
                manualLink: constants.manualDownloadLink,
              };
              this.postUpdateInfo(updateInfo);
            })
            .catch((e) => {
              console.error("从Gitee获取最新版本更新日志失败");
            });
        } else {
          console.log("Gitee显示当前即为最新版本");
        }
      })
      .catch((e) => console.error("通过Gitee获取最新版本失败"));
  }

  showCurrentChangelog(targetVersion?: string) {
    const url = targetVersion
      ? getChangelogURL(targetVersion)
      : constants.currentChangelog;
    console.log("正在获取更新日志", url);
    this.get(url)
      .then(() => {
        this.controller.win.registerPostStart(() => {
          const win = this.getWindow(
            "更新日志",
            path.join(env.externalResource, "update", "changelog.html")
          );
          win.webContents.once("did-finish-load", () => {
            let buff = Buffer.from(url, "utf-8");
            let base64data = buff.toString("base64"); //这里因为是直接传，所以可能会存在一些问题，看看如果先加密再解密会不会好点
            win.webContents.executeJavaScript(`fetchPage("${base64data}");`);
          });
        });
        this.controller.set("isNewUser", false);
      })
      .catch((e) => {
        console.error("获取当前版本更新日志失败", url);
        // console.error(e);
      });
  }

  getWindow(title: string, file: string) {
    let win = this.win;
    if (!win) {
      win = new BrowserWindow({
        icon,
        title,
        parent: this.controller.win.mainWindow,
        modal: osType !== "Darwin",
        width: 800,
        height: 600,
        minimizable: false,
        autoHideMenuBar: true,
        webPreferences: {
          nodeIntegration: true,
          webSecurity: false,
        },
      }) as BrowserWindow;
      win.on("closed", (e: any) => {
        this.win = undefined;
      });
      this.win = win;
    }

    win.loadFile(file);
    if (process.env.NODE_ENV !== "production") win.webContents.openDevTools();
    return win;
  }

  postUpdateInfo(updateInfo: any) {
    const win = this.getWindow(
      "存在可用更新",
      path.join(env.externalResource, "update", "newer.html")
    );

    win.webContents.once("did-finish-load", () => {
      win.webContents.send("releaseNote", updateInfo);
    });
  }

  bindUpdateEvents() {
    autoUpdater.on("error", (error: Error) => {
      console.error("Github检查更新失败");
      this.checkTheGiteePages();
    });

    autoUpdater.on("update-available", (updateInfo) => {
      updateInfo.needCompile = false;
      updateInfo.isWin = require("os").platform == "win32";
      updateInfo.manualLink = constants.manualDownloadLink;
      this.postUpdateInfo(updateInfo);
    });

    autoUpdater.on("update-downloaded", () => {
      dialog
        .showMessageBox(BrowserWindow.getAllWindows()[0], {
          type: "info",
          title: "安装更新",
          icon: icon,
          message: "更新已下载",
          buttons: ["现在退出并安装", "退出后自动安装", "cancel"],
          cancelId: 2,
        })
        .then((res) => res.response)
        .then((response) => {
          if (response == 0) {
            setImmediate(() => autoUpdater.quitAndInstall());
          } else if (response == 1) {
            autoUpdater.autoInstallOnAppQuit = true;
          }
        });
    });

    ipcMain.on("confirm-update", (event, args: any) => {
      const win = BrowserWindow.fromWebContents(event.sender);
      if (win) {
        win.close();
      }
      autoUpdater.downloadUpdate();
    });
  }
}
