import { Translator, GoogleTranslator } from "../tools/translator";
import { initConfig, ConfigParser } from "../tools/configuration";
import { MessageType } from "../tools/enums";
import { WindowWrapper } from "../tools/windows";
import { windowController } from "../tools/windowController";
import { envConfig } from "../tools/envConfig";
import { l10n, L10N } from "../tools/l10n";
import { RuleName, reverseRuleName, ruleKeys } from "../tools/rule";
import { StringProcessor } from "./stringProcessor";
import { BrowserWindow, app, MenuItem } from "electron";
import { BaseMenu, getItems } from "../tools/menu";
const clipboard = require("electron-clipboard-extended");
const t = l10n.getT();

function routeTo(routerName: string) {
  var window = BrowserWindow.getFocusedWindow();
  if (window) {
    window.webContents.send(MessageType.Router.toString(), routerName);
  }
}

function onMenuClick(
  menuItem: MenuItem,
  browserWindow: BrowserWindow,
  event: Event,
  id: string
) {
  if (ruleKeys.includes(id)) {
    let controller = (<any>global).controller;
    controller.setByKeyValue(id, menuItem.checked);
  } else {
    switch (id) {
      case "switchMode":
        routeTo("Contrast");
        break;
      case "exit":
        app.exit();
        break;
      case "settings":
        routeTo("Settings");
        break;
    }
  }
}

class Controller {
  src: string = "";
  result: string = "";
  lastAppend: string = "";
  stringProccessor: StringProcessor = new StringProcessor();
  focusWin: WindowWrapper = new WindowWrapper();
  translator: Translator = new GoogleTranslator();
  config: ConfigParser;
  locales: L10N = l10n;
  menu = new BaseMenu(onMenuClick, t);

  constructor() {
    this.config = initConfig();
    this.config.loadValues(envConfig.sharedConfig.configPath);
    this.restoreFromConfig();
  }

  createWindow() {
    this.focusWin.createWindow();
    windowController.bind();
  }
  checkClipboard() {
    let text = this.stringProccessor.normalizeAppend(clipboard.readText());
    if (text != this.result && text != this.src) {
      this.doTranslate(text);
    }
  }
  getT() {
    return this.locales.getT(this.config.get(RuleName.locale));
  }
  onError(msg: string) {
    (<any>global).log.error(msg);
  }

  doTranslate(text: string) {
    this.src = text;
    let source = this.source();
    let target = this.target();
    this.translator
      .translate(this.src, source, target)
      .then(res => {
        if (res) {
          this.result = res;
          this.focusWin.sendMsg(MessageType.TranslateResult.toString(), {
            src: this.src,
            result: this.result,
            source: source,
            target: target
          });
        } else {
          this.onError("translate error");
        }
      })
      .catch(err => {
        console.error(err);
      });
  }
  source() {
    return this.config.values.source;
  }
  target() {
    return this.config.values.target;
  }

  setWatch(watch: boolean) {
    if (watch) {
      clipboard.on("text-changed", () => {
        this.checkClipboard();
      });
      clipboard.startWatching();
    } else {
      clipboard.stopWatching();
    }
  }
  restoreFromConfig() {
    for (let keyValue in this.config.values) {
      this.setByKeyValue(keyValue, this.config.values[keyValue], false);
    }
  }
  setByKeyValue(ruleKey: string, value: any, save = true) {
    let ruleValue = reverseRuleName[ruleKey];
    switch (ruleValue) {
      case RuleName.isListen:
        this.setWatch(value);
        break;
      case RuleName.stayTop:
        this.focusWin.stayTop = value;
        if (this.focusWin.window) {
          this.focusWin.window.setAlwaysOnTop(value);
        }
        break;
    }
    if (save) {
      this.config.setByKeyValue(ruleKey, value);
      this.config.saveValues(envConfig.sharedConfig.configPath);
    }
  }
}
export { Controller };
