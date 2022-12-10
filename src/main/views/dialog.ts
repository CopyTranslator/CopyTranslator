import { dialog, BrowserWindow, shell } from "electron";
import { env, icon } from "../../common/env";
import store from "../../store";
import { constants, version } from "../../common/constant";
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
      title: "CopyTranslator 声明/Warning",
      type: "warning",
      message: [enWarning, zhWarning].join("\n"),
      buttons: [t["neverShow"], t["gotoSetting"]],
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
          eventBus.at("dispatch", "settings", "dragCopyConfig");
          break;
      }
    });
}

const enWarning2 =
  "You have enabled the white list mode of drag and drop replication, but there are no programs in the white list. Please go to Settings ->Drag and drop replication to add the programs to be dragged and copied to the white list, or drag and drop replication will not work properly.";
const zhWarning2 =
  "您启用了拖拽复制的白名单模式，然而白名单中没有任何程序，请您前往 设置->拖拽复制 把需要拖拽复制的程序加入白名单中，否则拖拽复制无法正常工作。";

export function showDragCopyEmptyWhitelistWarning(controller: MainController) {
  const t = store.getters.locale;
  dialog
    .showMessageBox(BrowserWindow.getAllWindows()[0], {
      title: "CopyTranslator 声明/Warning",
      type: "warning",
      message: [enWarning2, zhWarning2].join("\n"),
      buttons: [t["gotoSetting"]],
      icon: icon,
    })
    .then((res) => res.response)
    .then((response) => {
      switch (response) {
        case 0:
          eventBus.at("dispatch", "settings", "dragCopyConfig");
          break;
      }
    });
}

export function showHelpAndUpdate(controller: MainController) {
  const t = store.getters.locale;
  let buttons = [t["homepage"], t["userManual"], t["checkUpdate"], "cancel"];

  dialog
    .showMessageBox(BrowserWindow.getAllWindows()[0], {
      title: constants.appName + " " + version,
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
