import { dialog, nativeImage, BrowserWindow, shell } from "electron";
import { env, icon } from "../../common/env";
import store from "../../store";
import { constants, versionString } from "../../common/constant";
import eventBus from "../../common/event-bus";
import { Identifier } from "../../common/types";
import { Handler, MainController } from "../../common/controller";

const enWarning =
  "Ctrl + C is simulated when the drag copy is triggered. In most scenes, this means safe text copying, but in some scenes it may cause some unexpected problems, such as clipboard data being overwritten.  Triggering Ctrl + C in the shell will interrupt the running program and so on.  When you enable it, please be aware that after you enable the drag and drop option, you will be responsible for any possible losses.";
const zhWarning =
  "拖拽复制触发时会模拟Ctrl+C，大部分情况下，这都意味着安全的文本复制，但在某些场景中可能会引起一些意料之外的问题，如剪贴板数据被覆盖、在shell中触发Ctrl+C会使正在运行的程序中断等等。启用时请务必注意，当您启用拖拽复制选项后，任何可能由此导致的损失均由您自行负责。";

export function showDragCopyWarning(controller: MainController) {
  const t = store.getters.locale;
  dialog
    .showMessageBox(BrowserWindow.getAllWindows()[0], {
      title: "声明/Warning",
      message: [enWarning, zhWarning].join("\n"),
      buttons: [t["neverShow"], t["ok"]],
      icon: icon,
    })
    .then((res) => res.response)
    .then((response) => {
      switch (response) {
        case 0:
          store.dispatch("updateConfig", {
            neverShow: true,
          });
          break;
        case 1:
          break;
      }
    });
}

const enHostsMessage =
  "Since Google has stopped its translation service in mainland China, CopyTranslator needs to request administrator permission to change hosts so that you can continue to use fast Google translation";
const zhHostsMessage =
  "由于谷歌停止了在大陆的翻译服务，CopyTranslator需要请求管理员权限来更改hosts以使得您可以继续使用谷歌翻译";

function setHosts() {
  const fs = require("fs");
  const path = require("path");
  const hosts_exe = path.join(env.externalResource, "hosts.exe");
  var sudo = require("sudo-prompt-alt");
  var options = {
    name: "Electron",
    // icns: path.join(process.resourcesPath, "icon.ico"), // (optional)
  };
  sudo.exec(
    `"${hosts_exe}" set translate.googleapis.com 180.163.151.162  && ipconfig /flushdns`,
    // "echo. >> %WINDIR%\\System32\\Drivers\\Etc\\Hosts && echo 180.163.151.162 translate.googleapis.com >> %WINDIR%\\System32\\Drivers\\Etc\\Hosts && ipconfig /flushdns",
    options,
    function (error: any, stdout: any, stderr: any) {
      if (error) throw error;
      console.log("stdout: " + stdout);
    }
  );
}

export function showHostsWarning(controller: MainController) {
  const t = store.getters.locale;
  dialog
    .showMessageBox(BrowserWindow.getAllWindows()[0], {
      title: "声明/Message",
      message: [enHostsMessage, zhHostsMessage].join("\n"),
      buttons: [t["ok"]],
      icon: icon,
    })
    .then((res) => res.response)
    .then((response) => {
      switch (response) {
        case 0:
          setHosts();
          store.dispatch("updateConfig", {
            hostsSet: true,
          });
          break;
      }
    });
}

export function showHelpAndUpdate(controller: MainController) {
  const t = store.getters.locale;
  dialog
    .showMessageBox({
      title: constants.appName + " " + versionString,
      message:
        "If you found it useful, please give me a star on GitHub or introduce to your friend.\n如果您感觉本软件对您有所帮助，请在项目Github上给个star或是介绍给您的朋友，谢谢。\n本软件免费开源，如果您是以付费的方式获得本软件，那么你应该是被骗了。[○･｀Д´･ ○]",
      buttons: [t["homepage"], t["userManual"], t["checkUpdate"], "cancel"],
      cancelId: 3,
      icon: icon,
    })
    .then((res) => res.response)
    .then((response) => {
      switch (response) {
        case 0:
          shell.openExternal(constants.homepage);
          break;
        case 1:
          shell.openExternal(constants.wiki);
          break;
        case 2:
          eventBus.at("dispatch", "checkUpdate");
          break;
      }
    });
}

export function showConfigFile() {
  shell.openItem(env.configPath);
}
export function showConfigFolder() {
  shell.openItem(env.configDir);
}

const actionLinks = new Map<Identifier, Handler>([
  ["editConfigFile", showConfigFile],
  ["showConfigFolder", showConfigFolder],
  ["helpAndUpdate", showHelpAndUpdate],
]);

export default actionLinks;
