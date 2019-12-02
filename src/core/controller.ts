import { Compound, TranslatorType } from "../tools/translate";
import { Language } from "@opentranslate/translator";
import { CopyTranslateResult } from "../tools/translate/types";
import { initConfig } from "../tools/configuration";
import { ConfigParser } from "../tools/configParser";
import { ColorStatus, MessageType, WinOpt } from "../tools/enums";
import { WindowWrapper } from "../tools/views/windows";
import { windowController } from "../tools/windowController";
import simulate from "../tools/simulate";
import { env } from "../tools/env";
import { l10n, L10N } from "../tools/l10n";
import { colorRules, getColorRule } from "../tools/rule";
import { normalizeAppend } from "../tools/translate/helper";
import { app } from "electron";
import { ActionManager } from "../tools/action";
import { TrayManager } from "../tools/tray";
import { handleActions } from "./actionCallback";
import { recognizer } from "../tools/ocr";
import { Identifier, authorizeKey } from "../tools/types";
import { startService } from "./service";
import { Polymer } from "../tools/dictionary/polymer";
import { DictionaryType } from "../tools/dictionary/types";

const clipboard = require("electron-clipboard-extended");

class Controller {
  exited = false;
  src: string = "";
  result: string = "";
  res: CopyTranslateResult | undefined;
  lastAppend: string = "";
  win: WindowWrapper = new WindowWrapper();
  translator: Compound = new Compound("google", {});
  dictionary: Polymer = new Polymer("google");
  config: ConfigParser = initConfig();
  l10n: L10N = l10n;
  action: ActionManager;
  tray: TrayManager = new TrayManager();
  translating: boolean = false; //正在翻译

  constructor() {
    this.config.loadValues(env.configPath);
    this.action = new ActionManager(handleActions, this);
    this.restoreFromConfig();
  }

  handleAction(cmd: string) {
    handleActions(cmd);
  }
  createWindow() {
    this.tray.init();
    this.win.createWindow(this.get("frameMode"));
    windowController.bind();
    this.action.init();
    recognizer.setUp();
    startService(this, authorizeKey);
  }

  onExit() {
    this.config.saveValues(env.configPath);
    this.action.unregister();
    this.exited = true;
    app.quit();
  }

  setSrc(append: string) {
    if (this.get("incrementalCopy") && this.src != "")
      this.src = this.src + " " + append;
    else this.src = append;
  }

  get<T>(identifier: Identifier) {
    return this.config.get(identifier) as T;
  }

  resotreDefaultSetting() {
    this.config.restoreDefault(env.configPath);
    this.restoreFromConfig();
  }

  clear() {
    this.src = "";
    this.result = "";
    this.lastAppend = "";
    this.res = undefined;
    this.sync();
  }

  checkClipboard() {
    let originalText = clipboard.readText();
    if (!this.checkLength(originalText)) {
      return;
    }
    let text = normalizeAppend(originalText, this.get<boolean>("autoPurify"));
    if (this.checkValid(text)) {
      this.doTranslate(text);
    }
  }

  tryTranslate(text: string, clear = false) {
    if (text != "") {
      if (clear) {
        this.clear();
      }
      this.doTranslate(normalizeAppend(text, this.get<boolean>("autoPurify")));
    }
  }

  getT() {
    return this.l10n.getT(this.get<Language>("localeSetting"));
  }

  sync(
    language: { source: Language; target: Language } | undefined = undefined
  ): void {
    if (!language) {
      language = {
        source: this.source(),
        target: this.target()
      };
    }
    let extra: any = {};
    this.win.sendMsg(
      MessageType.TranslateResult.toString(),
      Object.assign(
        {
          src: this.src,
          result: this.result,
          source: language.source,
          target: language.target,
          engine: this.get<TranslatorType>("translatorType"),
          notify: this.get<boolean>("enableNotify")
        },
        extra
      )
    );
  }
  checkLength(text: string) {
    const threshold = 3000;
    if (text.length > threshold || text.length == 0) {
      this.setCurrentColor(true);
      return false;
    } else return true;
  }

  checkValid(text: string) {
    const urlExp = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/;
    if (!this.checkLength(text)) {
      return false;
    }
    return !(
      urlExp.test(text) ||
      this.result == text ||
      this.src == text ||
      this.lastAppend == text ||
      text == ""
    );
  }

  postProcess(language: any, result: CopyTranslateResult) {
    if (this.get<boolean>("autoCopy")) {
      clipboard.writeText(this.result);
      if (this.get<boolean>("autoPaste")) {
        simulate.paste();
      }
    } else if (this.get<boolean>("autoFormat")) {
      clipboard.writeText(this.src);
    }
    this.setCurrentColor();
    if (this.get<boolean>("autoShow")) {
      this.win.edgeShow();
      this.win.show(
        !(this.get<boolean>("autoCopy") && this.get<boolean>("autoPaste"))
      );
    }
    this.res = result;
    this.sync(language);
  }

  getOptions() {
    let realOptions = 0;
    for (const [key, value] of colorRules) {
      if (this.get<boolean>(key)) {
        realOptions |= value;
      }
    }
    return realOptions;
  }

  setCurrentColor(fail = false) {
    if (fail) {
      this.win.switchColor(ColorStatus.Fail);
      return;
    }
    if (!this.get<boolean>("listenClipboard")) {
      this.win.switchColor(ColorStatus.None);
      return;
    }
    const options = this.getOptions();
    const incrementalCopy = getColorRule("incrementalCopy");
    const autoCopy = getColorRule("autoCopy");
    const autoPaste = getColorRule("autoPaste");
    switch (options) {
      case incrementalCopy | autoCopy | autoPaste:
        this.win.switchColor(ColorStatus.IncrementalCopyPaste);
        return;
      case incrementalCopy | autoCopy:
        this.win.switchColor(ColorStatus.IncrementalCopy);
        return;
      case incrementalCopy:
        this.win.switchColor(ColorStatus.Incremental);
        return;
      case autoCopy | autoPaste:
        this.win.switchColor(ColorStatus.AutoPaste);
        return;
      case autoCopy:
        this.win.switchColor(ColorStatus.AutoCopy);
        return;
    }
    this.win.switchColor(ColorStatus.Listen);
  }

  async decideLanguage(text: string) {
    let should_src = this.source();
    let dest_lang = this.target();
    let src_lang = should_src;

    if (should_src === "auto") {
      src_lang = should_src;
    } else {
      try {
        let lang = await this.translator.detect(text);
        if (lang) src_lang = lang;
      } catch (e) {
        console.log(e);
      }
    }

    if (src_lang == dest_lang) {
      if (this.get<boolean>("smartTranslate")) {
        dest_lang = should_src;
      }
    }

    return {
      source: src_lang,
      target: dest_lang
    };
  }

  preProcess(text: string) {
    this.lastAppend = text;
    this.setSrc(text);
    this.win.switchColor(ColorStatus.Translating);
  }

  postTranslate(
    res: CopyTranslateResult,
    language: { source: Language; target: Language } | undefined = undefined
  ) {
    if (res) {
      const resultString = normalizeAppend(
        res.resultString,
        this.get("autoPurify")
      );
      this.result = resultString;
      this.postProcess(language, res);
    } else {
      this.setCurrentColor(true);
    }
  }

  setUpRecognizer(APP_ID: string, API_KEY: string, SECRET_KEY: string) {
    this.set("APP_ID", APP_ID, true, false);
    this.set("API_KEY", API_KEY, true, false);
    this.set("SECRET_KEY", SECRET_KEY, true, false);
    recognizer.setUp(true);
  }

  async doTranslate(text: string) {
    if (this.translating || !this.checkLength(text)) {
      //翻译无法被打断
      return;
    }
    if (this.checkIsWord(text)) {
      this.queryDictionary(text);
    } else {
      this.translateSentence(text);
    }
  }

  async queryDictionary(text: string) {
    this.dictionary.query(text).then();
  }

  checkIsWord(text: string) {
    if (text.length > 100) {
      return false;
    }
    if (/^[a-zA-Z0-9 ]+$/.test(text) && text.split(" ").length <= 3) {
      return true;
    } else {
      return false;
    }
  }

  async translateSentence(text: string) {
    this.translating = true;
    const language = await this.decideLanguage(text);
    if (language.source == language.target) {
      return;
    }
    this.preProcess(text);
    this.translator
      .translate(this.src, language.source, language.target)
      .then(res => this.postTranslate(res, language))
      .then(() => {
        this.translating = false;
      })
      .catch(err => {
        this.translating = false;
        console.error(err);
      });
  }

  switchTranslator(value: TranslatorType) {
    let valid = true;
    this.translator.setMainEngine(value);
    if (!this.translator.isValid(this.source())) {
      this.set("sourceLanguage", "en", true, true);
      valid = false;
    }
    if (!this.translator.isValid(this.target())) {
      this.set("targetLanguage", "zh-CN", true, true);
      valid = false;
    }
    if (valid) {
      try {
        this.postTranslate(this.translator.getBuffer(value));
        if (this.translator.src !== this.src) {
          throw "no the same src";
        }
      } catch (e) {
        this.doTranslate(this.src);
      }
    } else {
      this.doTranslate(this.src);
    }
  }

  switchDictionary(value: DictionaryType) {
    this.dictionary.setMainEngine(value);
  }

  source() {
    return this.get<Language>("sourceLanguage");
  }

  target() {
    return this.get<Language>("targetLanguage");
  }

  postProcessImage(words_result: Array<{ words: string }>) {
    let src = words_result.map(item => item["words"]).join("\n");
    this.tryTranslate(src);
  }

  setWatch(watch: boolean) {
    if (watch) {
      clipboard.on("text-changed", () => {
        this.checkClipboard();
      });
      clipboard.on("image-changed", () => {
        // OCR 相关TranslateResult
        recognizer.recognize(clipboard.readImage().toDataURL());
      });
      clipboard.startWatching();
    } else {
      clipboard.stopWatching();
    }
  }

  restoreWindow(routeName: Identifier | undefined) {
    if (routeName) this.win.restore(this.get(routeName));
  }

  restoreFromConfig() {
    for (let key of this.config.values.keys()) {
      this.set(key, this.get(key), false);
    }
  }

  switchValue(identifier: Identifier) {
    this.set(identifier, !this.get(identifier));
  }

  refresh(identifier: Identifier | null = null) {
    this.win.winOpt(WinOpt.Refresh, identifier);
  }

  set(
    identifier: Identifier,
    value: any,
    save: boolean = true,
    refresh: boolean = true
  ): boolean {
    if (this.config.set(identifier, value)) {
      this.postSet(identifier, value, save, refresh);
      return true;
    }
    return false;
  }

  postSet(identifier: Identifier, value: any, save = true, refresh = true) {
    switch (identifier) {
      case "listenClipboard":
        this.setWatch(value);
        break;
      case "stayTop":
        if (this.win.window) {
          this.win.window.focus();
          this.win.window.setAlwaysOnTop(value);
        }
        break;
      case "skipTaskbar":
        this.win.setSkipTaskbar(value);
        break;
      case "incrementalCopy":
        this.clear();
        break;
      case "autoFormat":
        if (value) {
          this.set("autoCopy", false, save, refresh);
        }
        break;
      case "autoCopy":
        if (value) {
          this.set("autoFormat", false, save, refresh);
        }
        break;
      case "dragCopy":
        windowController.dragCopy = value;
        break;
      case "translatorType":
        this.switchTranslator(value as TranslatorType);
        break;
      case "dictionaryType":
        this.switchDictionary(value as DictionaryType);
        break;
      case "localeSetting":
        this.win.sendMsg(MessageType.UpdateT.toString(), null);
        break;
    }
    this.setCurrentColor();

    if (save) {
      this.config.saveValues(env.configPath);
      if (refresh) {
        this.refresh();
      } else if (identifier == "autoFormat") {
        this.refresh("autoCopy");
      } else if (identifier == "autoCopy") {
        this.refresh("autoPurify");
      }
    }
  }
}

export { Controller };
