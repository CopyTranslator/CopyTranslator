import { Translator, GoogleTranslator } from "../tools/translator";
import { initConfig, ConfigParser } from "../tools/configuration";
import { MessageType } from "../tools/enums";
import { WindowWrapper } from "../tools/windows";
import { windowController } from "../tools/windowController";
import { envConfig } from "../tools/envConfig";
import { l10n, L10N } from "../tools/l10n";
import { RuleName } from "../tools/rule";
const clipboard = require("electron-clipboard-extended");

class Controller {
  src: string = "";
  result: string = "";
  lastAppend: string = "";
  focusWin: WindowWrapper = new WindowWrapper();
  translator: Translator = new GoogleTranslator();
  config: ConfigParser;
  source: string = "English";
  target: string = "Chinese(Simplified)";
  locales: L10N = l10n;
  constructor() {
    this.config = initConfig();
    this.config.loadValues(envConfig.sharedConfig.configPath);
    this.setWatch(true);
  }
  createWindow() {
    this.focusWin.createWindow();
    windowController.bind();
    this.checkClipboard();
  }
  checkClipboard() {
    let text = clipboard.readText();
    if (text === this.src || text === this.result) {
      return;
    } else {
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
    this.translator
      .translate(text, this.source, this.target)
      .then(res => {
        if (res) {
          this.result = res;
          this.focusWin.sendMsg(MessageType.TrnaslateResult.toString(), {
            src: this.src,
            result: this.result,
            source: this.source,
            target: this.target
          });
        } else {
          this.onError("translate error");
        }
      })
      .catch(err => {
        console.error(err);
      });
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
  setByKeyValue(keyValue: string, value: any) {
    this.config.setByKeyValue(keyValue, value);
    this.config.saveValues(envConfig.sharedConfig.configPath);
  }
}
export { Controller };
