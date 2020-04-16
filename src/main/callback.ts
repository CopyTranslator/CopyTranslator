import { BrowserWindow, MenuItem } from "electron";
import { showSettings } from "../common/views";
import {
  Identifier,
  NormalActionType,
  RouteActionType,
  decompose
} from "../common/types";
import { clipboard } from "../common/clipboard";
const alias = new Map<string, string>([
  ["focus", "layoutType|focus"],
  ["contrast", "layoutType|horizontal"]
]);

function handleActions(
  id: string,
  menuItem: MenuItem | undefined = undefined,
  browserWindow: BrowserWindow | undefined = undefined,
  event: Event | undefined = undefined
) {
  if (alias.get(id) != undefined) {
    handleActions(alias.get(id) as string);
    return;
  }
  const params = decompose(id);
  const identifier = <Identifier>params[0];
  const param = params[1];
  const controller = global.controller;
  const action = controller.action.getAction(identifier);
  const intVal = parseInt(param);
  switch (action.actionType) {
    case "normal":
      handleNormalAction(<NormalActionType | RouteActionType>identifier);
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

function fontChange(scale: number) {
  const config = global.controller.config;

  // config.set("", config.get());
}

function handleNormalAction(identifier: NormalActionType | RouteActionType) {
  const controller = global.controller;
  switch (identifier) {
    case "font+":
      fontChange(1);
      break;
    case "font-":
      fontChange(-1);
      break;
    case "capture":
      global.shortcutCapture.shortcutCapture();
      break;
    case "clear":
      controller.transCon.clear();
      break;
    case "copySource":
      clipboard.writeText(controller.transCon.src);
      break;
    case "copyResult":
      clipboard.writeText(controller.transCon.resultString);
      break;
    case "settings":
      showSettings();
      break;
    case "helpAndUpdate":
      console.log("???");
      break;
    case "retryTranslate":
      controller.transCon.doTranslate(controller.transCon.src);
      break;
    case "restoreDefault":
      controller.resotreDefaultSetting();
      break;
  }
}

export { handleActions };
