import {RuleName, reverseRuleName, ruleKeys} from "../tools/rule";

import {BrowserWindow, MenuItem, shell} from "electron";

import {constants} from "../core/constant";
import {Controller} from "@/core/controller";

const clipboard = require("electron-clipboard-extended");

function handleActions(
    id: string,
    menuItem: MenuItem | undefined = undefined,
    browserWindow: BrowserWindow | undefined = undefined,
    event: Event | undefined = undefined
) {
    const controller = (<Controller>(<any>global).controller);
    if (ruleKeys.includes(id)) {
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
                shell.openExternal(constants.homepage);
                break;
            case "retryTranslate":
                controller.doTranslate(controller.src);
        }
    }
}

export {handleActions};
