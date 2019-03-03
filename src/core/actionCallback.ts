import { RuleName, reverseRuleName, ruleKeys } from "../tools/rule";

import { dialog, BrowserWindow, MenuItem, nativeImage, shell } from "electron";
import { envConfig } from "../tools/envConfig";

import { constants } from "../core/constant";
import { Controller } from "@/core/controller";
import {compose, decompose} from "../tools/action";


const _ = require("lodash");

const clipboard = require("electron-clipboard-extended");

function handleActions(
  id: string,
  menuItem: MenuItem | undefined = undefined,
  browserWindow: BrowserWindow | undefined = undefined,
  event: Event | undefined = undefined
) {
  const controller = <Controller>(<any>global).controller;
  console.log(id);
  const params=decompose(id);
  id=params[0];
  const param=params[1];
  if (ruleKeys.includes(id)) {
    if(param){
      console.log("true");
      controller.setByKeyValue(id,parseInt(param));
      return;
    }
    if (menuItem) {
      controller.setByKeyValue(id, menuItem.checked);
    } else {
      controller.switchValue(id);
    }
  } else {
    switch (id) {
      case "contrastMode":
        controller.win.routeTo("Contrast");
        break;
      case "focusMode":
        controller.win.routeTo("Focus");
        break;
      case "exit":
        controller.onExit();
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
        controller.win.routeTo("Settings");
        break;
      case "helpAndUpdate":
        //
        dialog.showMessageBox(
          {
            title: _.join(
              [
                constants.appName,
                constants.version,
                constants.nickName,
                constants.stage
              ],
              " "
            ),
            message:
              "If you found it useful, please give me a star on GitHub or introduce to your friend.\n如果您感觉本软件对您有所帮助，请在项目Github上给个star或是介绍给您的朋友，谢谢。\n本软件免费开源，如果您是以付费的方式获得本软件，那么你应该是被骗了。[○･｀Д´･ ○]",
            buttons: ["官网", "用户手册", "检查更新", "cancel"],
            icon: nativeImage.createFromPath(envConfig.diffConfig.iconPath)
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
                shell.openExternal(constants.downloadPage);
                break;
            }
          }
        );

        break;
      case "retryTranslate":
        controller.doTranslate(controller.src);
    }
  }
}

export { handleActions };
