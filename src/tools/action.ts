import { RuleName, reverseRuleName, ruleKeys } from "../tools/rule";

import { BrowserWindow, MenuItem, shell } from "electron";

import { constants } from "../core/constant";

const clipboard = require("electron-clipboard-extended");

enum ActionType {
  Switch,
  Event
}

interface Action {
  label: string; //给人看的
  type: ActionType;
  checked?: boolean; //对于Switch才有这项属性
  id: string;
  callback?: Function;
}

function onMenuClick(
  menuItem: MenuItem,
  browserWindow: BrowserWindow,
  event: Event,
  id: string
) {
  var controller = (<any>global).controller;
  if (ruleKeys.includes(id)) {
    controller.setByKeyValue(id, menuItem.checked);
  } else {
    switch (id) {
      case "contrastMode":
        controller.focusWin.routeTo("Contrast");
        break;
      case "focusMode":
        controller.focusWin.routeTo("Focus");
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
        controller.focusWin.routeTo("Settings");
        break;
      case "helpAndUpdate":
        shell.openExternal(constants.homepage);
        break;
    }
  }
}
export { onMenuClick };
