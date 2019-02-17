import { Translator, GoogleTranslator } from "../tools/translator";
import { initConfig } from "../tools/configuration";
import { ConfigParser, getEnumValue } from "../tools/configParser";
import { MessageType, WinOpt, ColorStatus } from "../tools/enums";
import { WindowWrapper } from "../tools/windows";
import { windowController } from "../tools/windowController";
import { envConfig } from "../tools/envConfig";
import { l10n, L10N } from "../tools/l10n";
import { RuleName, reverseRuleName, ruleKeys } from "../tools/rule";
import { StringProcessor } from "./stringProcessor";
import { BrowserWindow, app, MenuItem, shell } from "electron";
import { BaseMenu } from "../tools/menu";
import { TrayManager } from "../tools/tray";
import { constants } from "./constant";

const clipboard = require("electron-clipboard-extended");

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

class Controller {
  src: string = "";
  result: string = "";
  lastAppend: string = "";
  stringProccessor: StringProcessor = new StringProcessor();
  focusWin: WindowWrapper = new WindowWrapper();
  translator: Translator = new GoogleTranslator();
  config: ConfigParser = initConfig();
  locales: L10N = l10n;
  menu = new BaseMenu(onMenuClick);
  tray: TrayManager = new TrayManager();
  isWord: boolean = false;
  constructor() {
    this.config.loadValues(envConfig.sharedConfig.configPath);
    this.restoreFromConfig();
  }

  createWindow() {
    this.focusWin.createWindow(this.config.values.focus);
    windowController.bind();
    this.tray.init();
  }

  onExit() {
    let focus = Object.assign(
      this.config.values.focus,
      this.focusWin.getBound()
    );
    this.setByKeyValue("focus", focus);
    app.quit();
  }

  setSrc(append: string) {
    if (this.get(RuleName.incrementalCopy) && this.src != "")
      this.src = this.src + " " + append;
    else this.src = append;
  }

  get(ruleName: RuleName) {
    return this.config.values[getEnumValue(ruleName)];
  }

  clear() {
    this.src = "";
    this.result = "";
    this.lastAppend = "";
    this.sync();
  }

  checkClipboard() {
    let text = clipboard.readText();
    if (
      this.result == text ||
      this.src == text ||
      this.lastAppend == text ||
      text == ""
    )
      return;
    text = this.stringProccessor.normalizeAppend(clipboard.readText());
    if (this.check_valid(text)) {
      this.doTranslate(text);
    }
  }

  getT() {
    return this.locales.getT(this.config.get(RuleName.locale));
  }

  onError(msg: string) {
    (<any>global).log.error(msg);
  }

  sync(language: any = null) {
    if (!language)
      language = {
        source: this.source(),
        target: this.target()
      };
    this.focusWin.sendMsg(MessageType.TranslateResult.toString(), {
      src: this.src,
      result: this.result,
      source: language.source,
      target: language.target
    });
  }

  check_valid(text: string) {
    console.log("?", text);
    console.log(this.src);
    if (
      this.result == text ||
      this.src == text ||
      this.lastAppend == text ||
      text == ""
    ) {
      return false;
    } else {
      this.isWord =
        this.get(RuleName.smartDict) &&
        text.split(" ").length <= 3 &&
        !StringProcessor.isChinese(text) &&
        !this.get(RuleName.incrementalCopy);
      return true;
    }
  }

  postProcess(language: any) {
    if (this.get(RuleName.autoCopy)) {
      clipboard.writeText(this.result);
    } else if (this.get(RuleName.autoPurify)) {
      clipboard.writeText(this.src);
    }
    this.setCurrentColor();
    this.sync(language);
  }

  setCurrentColor() {
    const listen = this.get(RuleName.listenClipboard);
    const copy = this.get(RuleName.autoCopy);
    const incremental = this.get(RuleName.incrementalCopy);
    if (!listen) {
      this.focusWin.switchColor(ColorStatus.None);
      return;
    }
    if (incremental) {
      if (copy) {
        this.focusWin.switchColor(ColorStatus.IncrementalCopy);
      } else {
        this.focusWin.switchColor(ColorStatus.Incremental);
      }
      return;
    }
    if (copy) {
      this.focusWin.switchColor(ColorStatus.AutoCopy);
      return;
    }
    this.focusWin.switchColor(ColorStatus.Listen);
  }

  preProcess(text: string) {
    this.lastAppend = text;
    this.setSrc(text);
    let source = this.source();
    let target = this.target();
    this.focusWin.switchColor(ColorStatus.Translating);
    return {
      source: source,
      target: target
    };
  }
  doTranslate(text: string) {
    const language = this.preProcess(text);
    this.translator
      .translate(this.src, language.source, language.target)
      .then(res => {
        if (res) {
          this.result = res;
          this.postProcess(language);
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
      case RuleName.listenClipboard:
        this.setWatch(value);
        break;
      case RuleName.stayTop:
        this.focusWin.stayTop = value;
        if (this.focusWin.window) {
          this.focusWin.window.focus();
          this.focusWin.window.setAlwaysOnTop(value);
        }
        break;
      case RuleName.incrementalCopy:
        this.clear();
        break;
      case RuleName.autoPurify:
        if (value) {
          this.setByKeyValue(getEnumValue(RuleName.autoCopy), false);
        }
        break;
      case RuleName.autoCopy:
        if (value) {
          this.setByKeyValue(getEnumValue(RuleName.autoPurify), false);
        }
        break;
    }
    if (save) {
      this.config.setByKeyValue(ruleKey, value);
      this.setCurrentColor();
      this.config.saveValues(envConfig.sharedConfig.configPath);
    }
  }
}
export { Controller };
