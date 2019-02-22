import { Translator, GoogleTranslator } from "../tools/translator";
import { initConfig } from "../tools/configuration";
import { ConfigParser, getEnumValue } from "../tools/configParser";
import { MessageType, ColorStatus } from "../tools/enums";
import { WindowWrapper } from "../tools/windows";
import { windowController } from "../tools/windowController";
import { envConfig } from "../tools/envConfig";
import { l10n, L10N } from "../tools/l10n";
import { RuleName, reverseRuleName, ruleKeys } from "../tools/rule";
import { normalizeAppend, isChinese } from "./stringProcessor";
import { app, Rectangle,clipboard } from "electron";
import { ActionManager } from "../tools/action";
import { TrayManager } from "../tools/tray";
import { handleActions } from "./actionCallback";

class Controller {
  src: string = "";
  result: string = "";
  lastAppend: string = "";
  focusWin: WindowWrapper = new WindowWrapper();
  translator: Translator = new GoogleTranslator();
  config: ConfigParser = initConfig();
  locales: L10N = l10n;
  action = new ActionManager(handleActions);
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
    this.action.init();
    setInterval(this.checkClipboard,1000);
  }

  onExit() {
    let focus = Object.assign(
      this.config.values.focus,
      this.focusWin.getBound()
    );
    this.setByKeyValue("focus", focus);
    this.action.unregister();
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
    let text = normalizeAppend(clipboard.readText());
    if (this.checkValid(text)) {
      this.doTranslate(text);
    }
  }

  tryTranslate(text: string) {
    if (text != "") {
      this.doTranslate(normalizeAppend(text));
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

  checkValid(text: string) {
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
        !isChinese(text) &&
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
    this.focusWin.edgeShow();
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
          this.setCurrentColor();
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
    console.log("set")
  }

  saveWindow(routeName: string, bound: Rectangle, fontSize: number) {
    this.setByKeyValue(
      routeName,
      Object.assign(this.config.values[routeName], bound, {
        fontSize: fontSize
      })
    );
  }

  restoreWindow(routeName: string) {
    this.focusWin.restore(this.config.values[routeName]);
  }

  restoreFromConfig() {
    for (let keyValue in this.config.values) {
      this.setByKeyValue(keyValue, this.config.values[keyValue], false);
    }
  }

  switchValue(ruleKey: string) {
    this.setByKeyValue(ruleKey, !this.config.values[ruleKey]);
  }

  setByKeyValue(ruleKey: string, value: any, save = true) {
    let ruleValue = reverseRuleName[ruleKey];
    switch (ruleValue) {
      case RuleName.listenClipboard:
        this.setWatch(value);
        break;
      case RuleName.stayTop:
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
