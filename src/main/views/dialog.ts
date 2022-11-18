import { dialog, BrowserWindow, shell } from "electron";
import { env, icon } from "../../common/env";
import store from "../../store";
import { constants, versionString } from "../../common/constant";
import eventBus from "../../common/event-bus";
import { Identifier } from "../../common/types";
import { Handler, MainController } from "../../common/controller";

const enWarning =
  "It is strongly recommended that you enable the white list mode of drag replication (Settings ->DragCopy), so that drag replication will be triggered in specific programs. Ctrl + C is simulated when the drag copy is triggered. In most scenes, this means safe text copying, but in some scenes it may cause some unexpected problems, such as clipboard data being overwritten.  Triggering Ctrl + C in the shell will interrupt the running program and so on.  When you enable it, please be aware that after you enable the drag and drop option, you will be responsible for any possible losses.";
const zhWarning =
  "强烈建议您启用拖拽复制的白名单模式（设置->拖拽复制），这样在特定程序才会触发拖拽复制。拖拽复制触发时会模拟Ctrl+C，大部分情况下，这都意味着安全的文本复制，但在某些场景中可能会引起一些意料之外的问题，如剪贴板数据被覆盖、在shell中触发Ctrl+C会使正在运行的程序中断等等。启用时请务必注意，当您启用拖拽复制选项后，任何可能由此导致的损失均由您自行负责。";

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
  "Google has stopped the translation service in the mainland. After version 10.2.3, the domestic mirror of Google Translate is used by default for translation. In theory, no additional settings are required. If there are still problems, please refer to the following link for settings.";
const zhHostsMessage =
  "谷歌停止了在大陆的翻译服务，10.2.3版本后默认使用谷歌翻译国内镜像进行翻译，理论上不需要额外设置，如果依然存在问题，请参考以下链接进行设置";

export function showHostsWarning(controller: MainController) {
  const t = store.getters.locale;
  dialog
    .showMessageBox(BrowserWindow.getAllWindows()[0], {
      title: "提示/Message",
      message: [enHostsMessage, zhHostsMessage].join("\n"),
      buttons: [t["openReference"], t["neverShow"], "cancel"],
      icon: icon,
    })
    .then((res) => res.response)
    .then((response) => {
      switch (response) {
        case 0:
          shell.openExternal(
            "https://copytranslator.gitee.io/guide/questions.html#%E8%B0%B7%E6%AD%8C%E7%BF%BB%E8%AF%91%E9%80%80%E5%87%BA%E4%B8%AD%E5%9B%BD%E5%B8%82%E5%9C%BA%E7%9A%84%E8%A7%A3%E5%86%B3%E6%96%B9%E6%A1%88"
          );
          break;
        case 1:
          store.dispatch("updateConfig", {
            showGoogleMessage: false,
          });
          break;
      }
    });
}

export function showHelpAndUpdate(controller: MainController) {
  const t = store.getters.locale;
  let buttons = [t["homepage"], t["userManual"], t["checkUpdate"], "cancel"];

  dialog
    .showMessageBox(BrowserWindow.getAllWindows()[0], {
      title: constants.appName + " " + versionString,
      message:
        "If you found it useful, please give me a star on GitHub or introduce to your friend.\n如果您感觉本软件对您有所帮助，请在项目Github上给个star或是介绍给您的朋友，谢谢。\n本软件免费开源，如果您是以付费的方式获得本软件，那么你应该是被骗了。[○･｀Д´･ ○]",
      buttons: buttons,
      cancelId: 3,
      icon: icon,
    })
    .then((res) => res.response)
    .then((response) => {
      switch (response) {
        case 0:
          eventBus.at("dispatch", "homepage");
          break;
        case 1:
          eventBus.at("dispatch", "userManual");
          break;
        case 2:
          eventBus.at("dispatch", "checkUpdate");
          break;
      }
    });
}

const welcomeMessages = [
  "If you found it useful, please give me a star on GitHub or introduce to your friend.",
  "本软件功能较为丰富，有一定上手难度，如果您是第一次使用本软件，强烈您先阅读用户手册，能够极大地帮助您提升使用软件的效率，解决您的疑问。",
  "如果您感觉本软件对您有所帮助，请在项目Github上给个star或是介绍给您的朋友，谢谢。",
  "本软件免费开源，如果您是以付费的方式获得本软件，那么你应该是被骗了。[○･｀Д´･ ○]",
];

function welcome(controller: MainController) {
  const t = store.getters.locale;
  const buttons = [
    t["changelog"],
    t["userManual"],
    t["homepage"],
    t["checkUpdate"],
    t["neverShow"],
    "cancel",
  ];

  dialog
    .showMessageBox(BrowserWindow.getAllWindows()[0], {
      title: constants.appName + " " + versionString,
      message: welcomeMessages.join("\n"),
      buttons: buttons,
      cancelId: 3,
      icon: icon,
    })
    .then((res) => res.response)
    .then((response) => {
      switch (response) {
        case 0:
          eventBus.at("dispatch", "changelog");
          break;
        case 1:
          eventBus.at("dispatch", "userManual");
          break;
        case 2:
          eventBus.at("dispatch", "homepage");
          break;
        case 3:
          eventBus.at("dispatch", "checkUpdate");
          break;
        case 4:
          store.dispatch("updateConfig", {
            isNewUser: false,
          });
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
  ["welcome", welcome],
]);

export default actionLinks;
