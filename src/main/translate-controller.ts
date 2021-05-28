import { Compound } from "../common/translate/compound";
import { emptySharedResult, SharedResult } from "../common/translate/constants";
import { Polymer } from "../common/dictionary/polymer";
import { Language } from "@opentranslate/translator";
import { CopyTranslateResult } from "../common/translate/types";
import { colorRules, getColorRule, KeyConfig } from "../common/rule";
import {
  normalizeAppend,
  checkIsWord,
  isChinese,
  notEnglish,
} from "../common/translate/helper";
import {
  Identifier,
  ColorStatus,
  colorStatusMap,
  TranslatorType,
  translatorTypes,
} from "../common/types";
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
import { recognizer } from "./ocr";
import eventBus from "@/common/event-bus";
import logger from "@/common/logger";
import { getLanguageLocales } from "@/common/translate/locale";
import isTrad from "@/common/translate/detect-trad";
import { Comparator } from "@/common/translate/comparator";
import { examToken } from "@/common/translate/token";
import {
  getTranslator,
  translatorMap,
  translators,
} from "@/common/translate/translators";
import { axios } from "@/common/translate/proxy";

class TranslateController {
  text: string = "";
  resultString: string = "";
  translateResult: CopyTranslateResult | undefined;
  dictResult: SharedDictResult = emptyDictResult();
  lastAppend: string = "";
  translating: boolean = false; //正在翻译
  words: string = "";
  incrementSelect: boolean = false;

  translator: Compound = new Compound([...translatorTypes], "google", {});
  dictionary: Polymer = new Polymer("google");

  controller: MainController;

  comparator: Comparator;

  constructor(controller: MainController) {
    this.controller = controller;
    this.syncSupportLanguages();
    this.comparator = new Comparator(this.translator);
  }

  init() {
    clipboard.init();
  }

  handle(identifier: Identifier, param: any): boolean {
    switch (identifier) {
      case "capture":
        recognizer.capture();
        break;
      case "translate":
        this.tryTranslate(param as string);
        break;
      case "translateClipboard":
        this.checkClipboard();
        break;
      case "doubleCopyTranslate":
        this.doubleCopyTranslate();
        break;
      case "clear":
        this.clear();
        break;
      case "copySource":
        clipboard.writeText(this.text);
        logger.toast("已复制原文");
        break;
      case "copyResult":
        clipboard.writeText(this.resultString);
        logger.toast("已复制译文");
        break;
      case "pasteResult":
        this.handle("copyResult", null);
        simulate.paste();
        break;
      case "incrementSelect":
        this.incrementSelect = true; //下一次监听剪贴板是增量选中
        break;
      case "retryTranslate":
        this.translate(this.text);
        break;
      case "selectionQuery":
        this.selectionQuary(param);
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
    const incremental =
      this.get<boolean>("incrementalCopy") || this.incrementSelect;
    if (incremental) {
      eventBus.at("dispatch", "toast", "增量复制");
    }
    if (incremental && this.text != "") {
      //TODO 这里需要做特殊处理，中文不需要加空格
      if (isChinese(append)) {
        this.text = this.text + append;
      } else {
        this.text = this.text + " " + append;
      }
    } else {
      this.text = append;
    }
    this.incrementSelect = false;
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
        transPara: this.translateResult.trans.paragraphs,
        textPara: this.translateResult.origin.paragraphs,
        chineseStyle: notEnglish(this.translateResult.to),
      };
    }
    store.dispatch("setShared", sharedResult);
    if (this.translateResult != undefined) {
      if (this.get<boolean>("enableNotify")) {
        eventBus.at("dispatch", "notify", sharedResult.translation);
      }
      logger.toast(
        `翻译完成 ${this.getL(<Language>sharedResult.from)} -> ${this.getL(
          <Language>sharedResult.to
        )}`
      );
    } else {
      logger.toast(`清空`);
    }
  }

  postProcess(language: any, result: CopyTranslateResult) {
    if (this.get<boolean>("autoCopy")) {
      clipboard.writeText(this.resultString);
      if (this.get<boolean>("autoPaste")) {
        setTimeout(simulate.paste, this.get<number>("pasteDelay") * 1000); //延时粘贴
      }
    } else if (this.get<boolean>("autoFormat")) {
      clipboard.writeText(this.text);
    }
    if (this.get<boolean>("autoShow")) {
      eventBus.at("dispatch", "showWindow");
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

  getL(lang: Language) {
    const l = getLanguageLocales(store.getters.localeSetting);
    return l[lang];
  }

  async decideLanguage(text: string) {
    const shouldSrc = this.source();
    let destLang = this.target();
    let srcLang = shouldSrc;

    let end = 50;
    if (text.length < 10) {
      end = text.length;
    }
    const textForDetect = text.substring(0, end);
    if (shouldSrc !== "auto") {
      //不是自动，那么就尝试检测语言
      try {
        let detectedLang = await this.translator.detect(textForDetect);
        if (detectedLang) {
          if (["zh-CN", "zh-TW"].includes(detectedLang)) {
            //因为繁简的检测似乎不太灵
            if (!isTrad(textForDetect)) {
              detectedLang = "zh-CN";
            } else {
              detectedLang = "zh-TW";
            }
          }
          srcLang = detectedLang;
        }
      } catch (e) {
        logger.log(e);
        logger.log("detect lang fail");
        logger.toast("检测语言失败");
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
    res.resultString = resultString;
    this.postProcess(language, res);
  }

  private async translate(text: string) {
    if (this.translating || !this.checkLength(text)) {
      //保证翻译时不被打断
      return;
    }
    this.translating = true;
    logger.debug("translate", text);

    Promise.allSettled([
      this.translateSentence(text),
      this.queryDictionary(text),
    ]).then(() => {
      this.translating = false;
      if (this.dictResult.words === this.text && !this.dictResult.valid) {
        //同步词典结果
        logger.debug("word fail");
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

  async selectionQuary(text: string) {
    logger.debug(text);
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
        logger.log("query dict fail");
        this.dictFail(text);
      });
  }

  async translateSentence(text: string) {
    const language = await this.decideLanguage(text);
    if (language.source == language.target) {
      return;
    }
    this.preProcess(text);
    const engines = this.get<TranslatorType[]>("translator-auto");
    return this.translator
      .translate(this.text, language.source, language.target, engines)
      .then((res) => this.postTranslate(res, language))
      .catch((err) => {
        this.translateFail();
        logger.error(err);
        logger.toast("翻译失败");
      });
  }

  async doubleCopyTranslate() {
    return this.checkClipboard();
  }

  async switchTranslator(value: TranslatorType) {
    let valid = true;
    this.translator.setMainEngine(value);

    //更新支持的语言
    this.syncSupportLanguages();

    //检查源语言是否支持
    if (!this.translator.isValid(this.source())) {
      this.controller.set("sourceLanguage", "en");
      valid = false;
    }

    //检查目标语言是否支持
    if (!this.translator.isValid(this.target())) {
      this.controller.set("targetLanguage", "zh-CN");
      valid = false;
    }

    if (valid) {
      //如果两种语言都支持的话
      try {
        const buffer = this.translator.getBuffer(value);
        if (!buffer || this.translator.text !== this.text) {
          throw "no cache";
        }
        logger.debug("cache hit");
        logger.debug(buffer);
        this.postTranslate(buffer);
      } catch (e) {
        logger.debug(e);
        this.translate(this.text);
      }
    } else {
      logger.debug("fallback lang");
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

  setWatch(watch: boolean) {
    if (watch) {
      clipboard.on("text-changed", () => {
        this.checkClipboard();
      });
      clipboard.on("image-changed", () => {
        // OCR 相关TranslateResult
        if (!recognizer.client) {
          return;
        }
        logger.toast("检测到剪贴板图片");
        recognizer.recognize(clipboard.readImage().toDataURL());
      });
      clipboard.startWatching();
      this.checkClipboard(); //第一次检查剪贴板
    } else {
      clipboard.stopWatching();
    }
  }
  updateTranslatorSetting(engine: TranslatorType) {
    const config = this.get(engine) as KeyConfig;
    if (!examToken(config)) {
      return;
    }

    const oldTranslator = getTranslator(engine);
    const TranslatorClass: any = oldTranslator.constructor;

    const newTranslator = new TranslatorClass({
      axios,
      config: this.get(engine),
    });
    translators.set(engine, newTranslator);
    eventBus.at("dispatch", "toast", `update  ${engine}`);
  }

  postSet(identifier: Identifier, value: any): boolean {
    if (translatorTypes.includes(identifier as TranslatorType)) {
      this.updateTranslatorSetting(identifier as TranslatorType);
      return true;
    }
    switch (identifier) {
      case "translator-auto":
        this.translator.setEngines(value);
        break;
      case "translator-double":
        logger.log("translator-double", value);
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
      case "baidu-ocr":
        recognizer.setUp(this.get("baidu-ocr"));
        break;
      default:
        return false;
    }
    this.setCurrentColor();
    return true;
  }
}

export { TranslateController };
