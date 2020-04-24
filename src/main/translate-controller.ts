import { Compound } from "../common/translate/compound";
import {
  TranslatorType,
  emptySharedResult,
  SharedResult,
  translatorTypes,
} from "../common/translate/constants";
import { Polymer } from "../common/dictionary/polymer";
import { Language } from "@opentranslate/translator";
import { CopyTranslateResult } from "../common/translate/types";
import { colorRules, getColorRule } from "../common/rule";
import { normalizeAppend, checkIsWord } from "../common/translate/helper";
import { Identifier, ColorStatus, colorStatusMap } from "../common/types";
import trimEnd from "lodash.trimend";
import simulate from "./simulate";
import {
  DictionaryType,
  SharedDictResult,
  emptyDictResult,
} from "../common/dictionary/types";
import { clipboard } from "./clipboard";
import { MainController } from "../common/controller";
import store from "@/store";
import { recognizer } from "../common/ocr";

class TranslateController {
  text: string = "";
  resultString: string = "";
  translateResult: CopyTranslateResult | undefined;
  dictResult: SharedDictResult = emptyDictResult();
  lastAppend: string = "";
  translating: boolean = false; //正在翻译
  words: string = "";

  translator: Compound = new Compound([...translatorTypes], "google", {});
  dictionary: Polymer = new Polymer("google");

  controller: MainController;

  constructor(controller: MainController) {
    this.controller = controller;
    this.syncSupportLanguages();
  }

  init() {
    clipboard.init();
    recognizer.setUp();
  }

  handle(identifier: Identifier, param: any): boolean {
    switch (identifier) {
      case "translate":
        this.tryTranslate(param as string);
        break;
      case "translateClipboard":
        this.checkClipboard();
        break;
      case "clear":
        this.clear();
        break;
      case "copySource":
        clipboard.writeText(this.text);
        break;
      case "copyResult":
        clipboard.writeText(this.resultString);
        break;
      case "retryTranslate":
        this.translate(this.text);
        break;
      default:
        return false;
    }
    return true;
  }

  syncSupportLanguages() {
    store.dispatch("setLanguages", this.translator.getSupportLanguages());
  }

  get<T>(identifier: Identifier) {
    return this.controller.get(identifier) as T;
  }

  setSrc(append: string) {
    if (this.get<boolean>("incrementalCopy") && this.text != "")
      this.text = this.text + " " + append;
    else {
      this.text = append;
    }
  }

  source() {
    return this.get<Language>("sourceLanguage");
  }

  target() {
    return this.get<Language>("targetLanguage");
  }

  clear() {
    this.text = "";
    this.resultString = "";
    this.lastAppend = "";
    this.translateResult = undefined;
    this.dictResult = emptyDictResult();
    this.sync();
    this.syncDict();
  }

  checkLength(text: string) {
    const threshold = 3000;
    if (text.length > threshold || text.length == 0) {
      return false;
    } else {
      return true;
    }
  }

  checkValid(text: string) {
    if (
      this.resultString == text ||
      this.text == text ||
      this.lastAppend == text ||
      text == ""
    ) {
      return false;
    } else {
      return true;
    }
  }

  checkClipboard() {
    const originalText = clipboard.readText();
    if (!this.checkLength(originalText)) {
      this.setCurrentColor(true);
      return;
    }
    const text = this.normalizeText(originalText);
    if (this.checkValid(text)) {
      this.translate(text);
    }
  }

  normalizeText(text: string) {
    text = normalizeAppend(text, this.get<boolean>("autoPurify"));
    if (this.isWord(text)) {
      text = trimEnd(text.trim(), ",.!?. \n\r");
    }
    return text;
  }

  tryTranslate(text: string, clear = false) {
    if (text != undefined && text != "") {
      if (clear) {
        this.clear();
      }
      this.translate(this.normalizeText(text));
    }
  }

  dictFail(text: string) {
    this.dictResult = emptyDictResult();
    if (this.translateResult && this.translateResult.text === text) {
      this.syncDict();
    }
  }

  translateFail() {
    this.translateResult = undefined;
    this.resultString = "";
    this.sync();
  }

  sync(language?: { source: Language; target: Language }) {
    if (!language) {
      language = {
        source: this.source(),
        target: this.target(),
      };
    }
    let sharedResult: SharedResult = emptySharedResult();
    if (this.translateResult != undefined) {
      sharedResult = {
        text: this.translateResult.text,
        translation: this.translateResult.resultString,
        from: this.translateResult.from,
        to: this.translateResult.to,
        engine: this.translateResult.engine,
        notify: this.get<boolean>("enableNotify"),
      };
    }
    store.dispatch("setShared", sharedResult);
  }

  postProcess(language: any, result: CopyTranslateResult) {
    if (this.get<boolean>("autoCopy")) {
      clipboard.writeText(this.resultString);
      if (this.get<boolean>("autoPaste")) {
        simulate.paste();
      }
    } else if (this.get<boolean>("autoFormat")) {
      clipboard.writeText(this.text);
    }
    if (this.get<boolean>("autoShow")) {
      console.log("auto show");
    }
    this.translateResult = result;
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
      this.setColor("Fail");
      return;
    }
    if (!this.get<boolean>("listenClipboard")) {
      this.setColor("None");
      return;
    }
    const options = this.getOptions();
    const incrementalCopy = getColorRule("incrementalCopy");
    const autoCopy = getColorRule("autoCopy");
    const autoPaste = getColorRule("autoPaste");
    switch (options) {
      case incrementalCopy | autoCopy | autoPaste:
        this.setColor("IncrementalCopyPaste");
        return;
      case incrementalCopy | autoCopy:
        this.setColor("IncrementalCopy");
        return;
      case incrementalCopy:
        this.setColor("Incremental");
        return;
      case autoCopy | autoPaste:
        this.setColor("AutoPaste");
        return;
      case autoCopy:
        this.setColor("AutoCopy");
        return;
    }
    this.setColor("Listen");
  }

  setColor(color: ColorStatus) {
    store.dispatch("setColor", colorStatusMap.get(color));
  }

  async decideLanguage(text: string) {
    const shouldSrc = this.source();
    let destLang = this.target();
    let srcLang = shouldSrc;

    if (shouldSrc !== "auto") {
      //不是自动，那么就尝试检测语言
      try {
        const detectedLang = await this.translator.detect(text);
        if (detectedLang) {
          srcLang = detectedLang;
        }
      } catch (e) {
        console.log("detect lang fail");
      }
    }

    if (srcLang === destLang) {
      if (this.get<boolean>("smartTranslate")) {
        destLang = shouldSrc;
      }
    }

    return {
      source: srcLang,
      target: destLang,
    };
  }

  preProcess(text: string) {
    this.lastAppend = text;
    this.setSrc(text);
    this.setColor("Translating");
  }

  postTranslate(
    res: CopyTranslateResult,
    language?: { source: Language; target: Language }
  ) {
    const resultString = normalizeAppend(
      res.resultString,
      this.get("autoPurify")
    );

    this.resultString = resultString;
    this.postProcess(language, res);
  }

  private async translate(text: string) {
    if (this.translating || !this.checkLength(text)) {
      //保证翻译时不被打断
      return;
    }
    this.translating = true;
    console.log("translate", text);

    Promise.allSettled([
      this.translateSentence(text),
      this.queryDictionary(text),
    ]).then(() => {
      this.translating = false;
      if (this.dictResult.words === this.text && !this.dictResult.valid) {
        //同步词典结果
        this.syncDict(); //翻译完了，然后发现词典有问题，这个时候才发送
        this.setCurrentColor(true);
      } else if (this.dictResult.words !== this.text && !this.translateResult) {
        this.setCurrentColor(true);
      } else {
        this.setCurrentColor();
      }
    });
  }

  syncDict() {
    store.dispatch("setDictResult", this.dictResult);
  }

  isWord(text: string) {
    text = trimEnd(text.trim(), ",.!?. ");
    if (
      !this.get("smartDict") ||
      !checkIsWord(text) ||
      this.get("incrementalCopy")
    ) {
      return false;
    }
    return true;
  }

  async queryDictionary(text: string) {
    this.dictFail("");
    this.syncDict();
    if (!this.isWord(text)) {
      this.dictFail("");
      return;
    }
    return this.dictionary
      .query(text)
      .then((res) => {
        if (res.explains.length != 0) {
          this.dictResult = {
            ...res,
            valid: true,
          };
          this.syncDict();
        } else {
          throw Error("query dict fail");
        }
      })
      .catch((e) => {
        console.log("query dict fail");
        this.dictFail(text);
      });
  }

  async translateSentence(text: string) {
    const language = await this.decideLanguage(text);
    if (language.source == language.target) {
      return;
    }
    this.preProcess(text);
    return this.translator
      .translate(this.text, language.source, language.target)
      .then((res) => this.postTranslate(res, language))
      .catch((err) => {
        this.translateFail();
        console.error(err);
      });
  }

  async switchTranslator(value: TranslatorType) {
    let valid = true;
    this.translator.setMainEngine(value);
    this.syncSupportLanguages();
    if (!this.translator.isValid(this.source())) {
      this.controller.set("sourceLanguage", "en");
      valid = false;
    }
    if (!this.translator.isValid(this.target())) {
      this.controller.set("targetLanguage", "zh-CN");
      valid = false;
    }
    if (valid) {
      try {
        const buffer = this.translator.getBuffer(value);
        if (!buffer || this.translator.text !== this.text) {
          throw "no the same src";
        }
        this.postTranslate(buffer);
      } catch (e) {
        console.log("invalid");
        this.translate(this.text);
      }
    } else {
      console.log("valid");
      this.translate(this.text);
    }
  }

  async switchDictionary(value: DictionaryType) {
    this.dictionary.setMainEngine(value);
    if (this.text === this.dictionary.words) {
      try {
        const res = await this.dictionary.getBuffer(value);
        if (res.explains.length != 0) {
          this.dictResult = {
            ...res,
            valid: true,
          };
        } else {
          throw Error("query dict fail");
        }
      } catch (e) {
        this.dictFail(this.text);
      }
      this.syncDict();
    }
  }

  postProcessImage(words_result: Array<{ words: string }>) {
    const src = words_result.map((item) => item["words"]).join("\n");
    this.tryTranslate(src);
  }

  setWatch(watch: boolean) {
    if (watch) {
      clipboard.on("text-changed", () => {
        this.checkClipboard();
      });
      clipboard.on("image-changed", () => {
        // OCR 相关TranslateResult
        //recognizer.recognize(clipboard.readImage().toDataURL());
      });
      clipboard.startWatching();
    } else {
      clipboard.stopWatching();
    }
  }

  postSet(identifier: Identifier, value: any): boolean {
    switch (identifier) {
      case "translator-auto":
        this.translator.setEngines(value);
        break;
      case "translator-double":
        console.log("translator-double", value);
        break;
      case "listenClipboard":
        this.setWatch(value);
        break;
      case "targetLanguage":
        this.translate(this.text);
        break;
      case "sourceLanguage":
        this.translate(this.text);
        break;
      case "incrementalCopy":
        this.clear();
        break;
      case "autoFormat":
        if (value) {
          this.controller.set("autoCopy", false);
        }
        break;
      case "autoCopy":
        if (value) {
          this.controller.set("autoFormat", false);
        }
        break;
      case "translatorType":
        this.switchTranslator(value as TranslatorType);
        break;
      case "dictionaryType":
        this.switchDictionary(value as DictionaryType);
        break;
      default:
        return false;
    }
    this.setCurrentColor();
    return true;
  }
}

export { TranslateController };
