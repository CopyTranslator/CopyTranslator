import { ruleKeys } from "../tools/rule";
import { dialog, BrowserWindow, MenuItem, nativeImage, shell } from "electron";
import { envConfig } from "../tools/envConfig";
import { checkForUpdates } from "../tools/views/update";
import { constants, version } from "../core/constant";
import { Controller } from "../core/controller";
import { decompose } from "../tools/action";
import { showSettings } from "../tools/views";
import { Identifier, identifiers } from "@/tools/identifier";

const clipboard = require("electron-clipboard-extended");

function handleActions(
  id: string,
  menuItem: MenuItem | undefined = undefined,
  browserWindow: BrowserWindow | undefined = undefined,
  event: Event | undefined = undefined
) {
  const params = decompose(id);
  const identifier = <Identifier>params[0];
  const param = params[1];
  const controller = <Controller>(<any>global).controller;
  const action = controller.action.getAction(identifier);
  const intVal = parseInt(param);
  switch (action.actionType) {
    case "normal":
      handleNormalAction(identifier);
      break;
    case "submenu":
    case "constant":
      controller.set(identifier, Number.isNaN(intVal) ? param : intVal);
      break;
    case "checkbox":
      if (menuItem) {
        // 设置切换按钮的值
        if ((<any>menuItem).type === "submenu") {
          return;
        }
        controller.set(identifier, menuItem.checked);
      } else {
        controller.switchValue(identifier);
      }
      break;
  }
}

function handleNormalAction(actionId: string) {
  const controller = <Controller>(<any>global).controller;
  const t = controller.getT();
  switch (actionId) {
    case "contrastMode":
      controller.win.routeTo("Contrast");
      break;
    case "focusMode":
      controller.win.routeTo("Focus");
      break;
    case "quit":
    case "exit":
      controller.onExit();
      break;
    case "capture":
      controller.capture();
      break;
    case "clear":
      controller.clear();
      break;
    case "copySource":
      clipboard.writeText(controller.src);
      break;
    case "copyResult":
      clipboard.writeText(controller.result);
      break;
    case "settings":
      showSettings();
      break;
    case "helpAndUpdate":
      dialog.showMessageBox(
        <BrowserWindow>controller.win.window,
        {
          title: constants.appName + " " + version,
          message:
            "If you found it useful, please give me a star on GitHub or introduce to your friend.\n如果您感觉本软件对您有所帮助，请在项目Github上给个star或是介绍给您的朋友，谢谢。\n本软件免费开源，如果您是以付费的方式获得本软件，那么你应该是被骗了。[○･｀Д´･ ○]",
          buttons: [t("homepage"), t("userManual"), t("checkUpdate"), "cancel"],
          cancelId: 3,
          icon: nativeImage.createFromPath(envConfig.iconPath)
        },
        function(response, checkboxChecked) {
          switch (response) {
            case 0:
              shell.openExternal(constants.homepage);
              break;
            case 1:
              shell.openExternal(constants.wiki);
              break;
            case 2:
              checkForUpdates();
              break;
          }
        }
      );
      break;
    case "retryTranslate":
      controller.doTranslate(controller.src);
      break;
    case "restoreDefault":
      controller.resotreDefaultSetting();
      break;
  }
}

export { handleActions };
