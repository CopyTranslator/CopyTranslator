import { Compound } from "../common/translate/compound";
import { emptySharedResult, SharedResult } from "../common/translate/constants";
import { Polymer } from "../common/dictionary/polymer";
import { Language, Translator } from "@opentranslate/translator";
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
import { pp_recognizer } from "./pp-ocr";
import eventBus from "@/common/event-bus";
import logger from "@/common/logger";
import { getLanguageLocales } from "@/common/translate/locale";
import isTrad from "@/common/translate/detect-trad";
import { Comparator } from "@/common/translate/comparator";
import { examToken } from "@/common/translate/token";
import { translators } from "@/common/translate/translators";
import { getProxyAxios } from "@/common/translate/proxy";
import bus from "@/common/event-bus";

class TranslateController {
  text: string = "";
  resultString: string = "";
  translateResult: CopyTranslateResult | undefined;
  dictResult: SharedDictResult = emptyDictResult();
  lastAppend: string = "";
  translating: boolean = false; //正在翻译
  words: string = "";
  incrementCounter: number = 0; //增量复制计数器

  translator: Compound = new Compound([...translatorTypes], "google", {});
  dictionary: Polymer = new Polymer("youdao");

  controller: MainController;

  comparator: Comparator;
  constructor(controller: MainController) {
    this.controller = controller;
    this.comparator = new Comparator(this.translator);
  }

  onExit() {
    pp_recognizer.onExit();
    return this.translator.onExit();
  }

  async init() {
    return Promise.allSettled([
      this.translator.initialize(),
      Promise.resolve(clipboard.init()),
    ]).then(() => {
      this.syncSupportLanguages();
    });
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
      case "incrementCounter":
        if (typeof param != "number") {
          param = 1; //下一次监听剪贴板是增量选中
        }
        this.incrementCounter = param as number;
        this.setCurrentColor();
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
    store.dispatch(
      "setSourceLanguages",
      this.translator.getSupportSourceLanguages()
    );
    store.dispatch(
      "setTargetLanguages",
      this.translator.getSupportTargetLanguages()
    );
    bus.iat("sourceLanguage"); //更新界面上的source和target列表
    bus.iat("targetLanguage");
  }

  get<T>(identifier: Identifier) {
    return this.controller.get(identifier) as T;
  }

  isIncremental(): boolean {
    return this.get<boolean>("incrementalCopy") || this.incrementCounter > 0;
  }

  setSrc(append: string) {
    const incremental = this.isIncremental();
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
    if (this.incrementCounter > 0) {
      this.handle("incrementCounter", this.incrementCounter - 1);
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
    this.lastAppend = "";
    this.clearResult();
  }

  clearResult() {
    this.resultString = "";
    this.translateResult = undefined;
    this.dictResult = emptyDictResult();
    this.comparator.clear();
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
    if (typeof originalText != "string") {
      return; //内容并非文本
    }
    if (!this.checkLength(originalText)) {
      this.setCurrentColor(true);
      return;
    }
    const text = this.normalizeText(originalText);
    if (this.checkValid(text)) {
      this.clearResult();
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
      if (key == "incrementalCopy") {
        if (this.isIncremental()) {
          realOptions |= value;
        }
      } else if (this.get<boolean>(key)) {
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
    const multiSource = this.get<boolean>("multiSource");

    if (multiSource) {
      //多源对比的时候指示灯应该是等全部翻译完了才出来
      eventBus.once("allTranslated", () => {
        this.translating = false;
        this.setCurrentColor();
      });
    }

    Promise.allSettled([
      this.translateSentence(text),
      this.queryDictionary(text),
    ]).then(() => {
      if (this.dictResult.words === this.text && !this.dictResult.valid) {
        //同步词典结果
        this.translating = false;
        logger.debug("word fail");
        this.syncDict(); //翻译完了，然后发现词典有问题，这个时候才发送
        this.setCurrentColor(true);
      } else if (this.dictResult.words !== this.text && !this.translateResult) {
        this.setCurrentColor(true);
        this.translating = false;
      } else {
        if (!multiSource) {
          this.translating = false;
          this.setCurrentColor(); //多源对比的时候指示灯应该是等全部翻译完了才出来
        }
      }
    });
  }

  syncDict() {
    store.dispatch("setDictResult", this.dictResult);
  }

  isWord(text: string) {
    text = trimEnd(text.trim(), ",.!?. ");
    if (!this.get("smartDict") || !checkIsWord(text) || this.isIncremental()) {
      return false;
    }
    return true;
  }

  async selectionQuary(text: string) {
    logger.debug(text);
  }

  async queryDictionary(text: string) {
    const isWord = this.isWord(text);
    this.dictFail("");
    this.syncDict();
    if (!isWord) {
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
    const activeEngines = this.get<TranslatorType[]>("translator-enabled");
    let engines = this.get<TranslatorType[]>("translator-cache");
    if (this.get<boolean>("multiSource")) {
      engines = this.get<TranslatorType[]>("translator-compare");
    }
    engines = engines.filter((engine) => activeEngines.includes(engine));
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
    if (!this.translator.getSupportSourceLanguages().includes(this.source())) {
      this.controller.set("sourceLanguage", "en");
      valid = false;
    }

    //检查目标语言是否支持
    if (!this.translator.getSupportSourceLanguages().includes(this.target())) {
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
        if (pp_recognizer.enabled()) {
          logger.toast("PP 检测到剪贴板图片");
          pp_recognizer.recognize_clipboard();
          return;
        }
        if (recognizer.enabled()) {
          logger.toast("检测到剪贴板图片");
          recognizer.recognize(clipboard.readImage().toDataURL());
          return;
        }
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

    const oldTranslator = translators.get(engine) as Translator;
    const TranslatorClass: any = oldTranslator.constructor;
    const newTranslator = new TranslatorClass({
      axios: getProxyAxios(true),
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
      case "googleMirror":
        this.translator.setUpGoogleOrigin();
        break;
      case "translator-enabled":
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
      case "pp-ocr":
        pp_recognizer.setUp(this.get("pp-ocr"));
        break;
      default:
        return false;
    }
    this.setCurrentColor();
    return true;
  }
}

export { TranslateController };
