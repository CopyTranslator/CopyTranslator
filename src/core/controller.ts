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
import { app, BrowserWindow } from "electron";
import { ActionManager } from "../tools/action";
import { TrayManager } from "../tools/tray";
import { handleActions } from "./actionCallback";
import { recognizer } from "../tools/ocr";
import { Identifier, authorizeKey } from "../tools/types";
import { startService } from "./service";
import { Polymer } from "../tools/dictionary/polymer";
import {
  DictionaryType,
  DictSuccess,
  DictFail
} from "../tools/dictionary/types";
import { showDragCopyWarning } from "../tools/views/dialog";
import { clipboard } from "../tools/clipboard";

class Controller {
  src: string = "";
  result: string = "";
  res: CopyTranslateResult | undefined;
  dictResult: DictSuccess | DictFail = { words: "", valid: false };
  lastAppend: string = "";
  win: WindowWrapper = new WindowWrapper();
  translator: Compound = new Compound("google", {});
  dictionary: Polymer = new Polymer("google");
  config: ConfigParser = initConfig();
  l10n: L10N = l10n;
  action: ActionManager;
  tray: TrayManager = new TrayManager();
  translating: boolean = false; //正在翻译
  exited: boolean = false; //已经退出
  words: string = "";

  constructor() {
    this.config.loadValues(env.configPath);
    this.action = new ActionManager(handleActions, this);
    this.restoreFromConfig();
  }

  handleAction(cmd: string) {
    handleActions(cmd);
  }

  createWindow() {
    clipboard.init();
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
    this.restoreFromConfig(true);
  }

  clear() {
    this.src = "";
    this.result = "";
    this.lastAppend = "";
    this.res = undefined;
    this.dictResult = {
      words: "",
      valid: false
    };
    this.sync();
    this.syncDict();
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

    this.win.sendMsg(MessageType.TranslateResult.toString(), {
      src: this.src,
      result: this.result,
      source: language.source,
      target: language.target,
      engine: this.get<TranslatorType>("translatorType"),
      notify: this.get<boolean>("enableNotify")
    });
  }

  checkLength(text: string) {
    const threshold = 3000;
    if (text.length > threshold || text.length == 0) {
      this.setCurrentColor(true);
      return false;
    } else return true;
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
      return true;
    }
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
    const resultString = normalizeAppend(
      res.resultString,
      this.get("autoPurify")
    );
    this.result = resultString;
    this.postProcess(language, res);
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
    this.translating = true;

    Promise.all([
      this.translateSentence(text),
      this.tryQueryDictionary(text)
    ]).then(() => {
      this.translating = false;
      if (this.dictResult.words === this.src && !this.dictResult.valid) {
        //同步词典结果
        this.syncDict(); //翻译完了，然后发现词典有问题，这个时候才发送
        this.setCurrentColor(true);
      } else if (this.dictResult.words !== this.src && !this.res) {
        this.setCurrentColor(true);
      } else {
        this.setCurrentColor();
      }
    });
  }

  syncDict() {
    this.win.sendMsg(MessageType.DictResult.toString(), this.dictResult);
  }

  dictFail(text: string) {
    this.dictResult = {
      words: text,
      valid: false
    };
    if (this.res && this.res.text === text) {
      this.syncDict();
    }
  }

  translateFail() {
    this.res = undefined;
    this.result = "";
    this.sync();
  }

  async tryQueryDictionary(text: string) {
    this.dictFail("");
    this.syncDict();
    if (
      !this.get("smartDict") ||
      !this.checkIsWord(text) ||
      this.get("incrementalCopy")
    ) {
      this.dictFail("");
      return;
    }
    return this.dictionary
      .query(text)
      .then(res => {
        if (res.explains.length != 0) {
          this.dictResult = {
            ...res,
            valid: true
          };
          this.syncDict();
        } else {
          throw Error("query dict fail");
        }
      })
      .catch(e => {
        console.log("query dict fail");
        this.dictFail(text);
      });
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
    const language = await this.decideLanguage(text);
    if (language.source == language.target) {
      return;
    }
    this.preProcess(text);
    return this.translator
      .translate(this.src, language.source, language.target)
      .then(res => this.postTranslate(res, language))
      .catch(err => {
        this.translateFail();
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
        let buffer = this.translator.getBuffer(value);
        if (!buffer || this.translator.src !== this.src) {
          throw "no the same src";
        }
        this.postTranslate(buffer);
      } catch (e) {
        this.doTranslate(this.src);
      }
    } else {
      this.doTranslate(this.src);
    }
  }

  switchDictionary(value: DictionaryType) {
    this.dictionary.setMainEngine(value);
    if (this.src === this.dictionary.words) {
      try {
        const res = this.dictionary.getBuffer(value);
        if (res.explains.length != 0) {
          this.dictResult = {
            ...res,
            valid: true
          };
        } else {
          throw Error("query dict fail");
        }
      } catch (e) {
        this.dictFail(this.src);
      }
      this.syncDict();
    }
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

  restoreFromConfig(fresh: boolean = false) {
    for (let key of this.config.values.keys()) {
      this.set(key, this.get(key), false, fresh);
    }
  }

  switchValue(identifier: Identifier) {
    this.set(identifier, !this.get(identifier));
  }

  refresh(identifier: Identifier | null = null) {
    for (const window of BrowserWindow.getAllWindows()) {
      window.webContents.send(MessageType.WindowOpt.toString(), {
        type: WinOpt.Refresh,
        args: identifier
      });
    }
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
      case "targetLanguage":
        this.doTranslate(this.src);
        break;
      case "sourceLanguage":
        this.doTranslate(this.src);
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
        if (value) {
          showDragCopyWarning();
        }
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
    }
    if (refresh) {
      this.refresh(identifier);
    } else if (identifier == "autoFormat") {
      this.refresh("autoCopy");
    } else if (identifier == "autoCopy") {
      this.refresh("autoPurify");
    }
  }
}

export { Controller };
