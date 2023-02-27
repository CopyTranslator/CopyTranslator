import { Compound } from "../common/translate/compound";
import { Polymer } from "../common/dictionary/polymer";
import { Language, Translator } from "@opentranslate/translator";
import {
  emptySharedResult,
  ResultBuffer,
  SharedResult,
} from "../common/translate/types";
import { colorRules, getColorRule, KeyConfig } from "../common/rule";
import {
  normalizeAppend,
  checkIsWord,
  isChinese,
} from "../common/translate/helper";
import {
  Identifier,
  ColorStatus,
  TranslatorType,
  translatorTypes,
  mapToObj,
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
import { examToken } from "@/common/translate/token";
import { translators } from "@/common/translate/translators";
import { getProxyAxios } from "@/common/translate/proxy";
import bus from "@/common/event-bus";
import { isValidWindow } from "./focus-handler";

type TranslateOption = {
  text?: string;
  updateLanguage?: boolean;
  clearResult?: boolean;
  dict?: boolean;
};

class TranslateController {
  translateResult: SharedResult | undefined;
  dictResult: SharedDictResult = emptyDictResult();

  text: string = "";
  lastAppend: string = "";

  language: { source: Language; target: Language } = {
    source: "auto",
    target: "auto",
  };

  needDict: boolean = false;

  translating: boolean = false; //正在翻译

  incrementCounter: number = 0; //增量复制计数器

  translator: Compound = new Compound([...translatorTypes], "google", {});
  dictionary: Polymer = new Polymer("youdao");

  controller: MainController;

  get resultString() {
    if (this.translateResult) {
      return this.translateResult.translation;
    } else {
      return "";
    }
  }

  constructor(controller: MainController) {
    this.controller = controller;
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

  getResultBuffer(engine: TranslatorType | "all") {
    if (engine == "all") {
      return mapToObj(
        this.translator.resultBuffer.resultBufferMap
      ) as ResultBuffer;
    } else {
      return this.translator.resultBuffer.resultBufferMap.get(engine);
    }
  }

  handle(identifier: Identifier, param: any): boolean {
    switch (identifier) {
      case "capture":
        recognizer.capture();
        break;
      case "translate":
        this.translateWithOption({
          text: param as string,
          updateLanguage: true,
          clearResult: true,
          dict: true,
        });
        break;
      case "translateClipboard":
        this.checkClipboard(false); //不需要进行检查
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
        if (!param) {
          clipboard.writeText(this.resultString);
          logger.toast("已复制译文");
        } else {
          //带参数的话就是复制特定的引擎的结果
          const buffer = this.getResultBuffer(param) as
            | SharedResult
            | undefined;
          if (buffer && buffer.status != "Translating") {
            clipboard.writeText(buffer.translation);
            console.log("复制成功", param);
          } else {
            console.log("复制失败", param);
          }
        }
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
        this.setCurrentStatus();
        break;
      case "retryTranslate":
        this.translateWithOption({
          updateLanguage: true,
          clearResult: true,
          dict: true,
        });
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
    store.dispatch("setLanguages", {
      sources: this.translator.getSupportSourceLanguages(),
      targets: this.translator.getSupportTargetLanguages(),
    }); //update-view插件会帮我们处理的
  }

  get<T>(identifier: Identifier) {
    return this.controller.get(identifier) as T;
  }

  get isIncremental(): boolean {
    return this.get<boolean>("incrementalCopy") || this.incrementCounter > 0;
  }

  setSrc(append: string) {
    this.lastAppend = append;
    const incremental = this.isIncremental;
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

  get source() {
    return this.get<Language>("sourceLanguage");
  }

  get target() {
    return this.get<Language>("targetLanguage");
  }

  clear() {
    this.text = "";
    this.lastAppend = "";
    this.clearResult();
  }

  clearResult() {
    this.translateResult = undefined;
    this.sync();
    this.clearDict();
  }

  clearDict() {
    this.dictResult = emptyDictResult();
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
      this.text == text ||
      this.lastAppend == text ||
      text == "" ||
      this.matchAnyResults(text)
    ) {
      return false;
    } else {
      return true;
    }
  }

  matchAnyResults(text: string) {
    const buffers = this.getResultBuffer("all") || {};
    for (const buffer of Object.values(buffers)) {
      if (buffer && buffer.status != "Translating") {
        if (buffer.translation == text) {
          return true;
        }
      }
    }
    return false;
  }

  checkClipboard(checkFocus: boolean = false): void {
    if (checkFocus) {
      isValidWindow("listenClipboard").then((valid) => {
        if (valid) {
          this.checkClipboard(false);
        } else {
          console.log("invalid window, not check clipboard");
        }
      });
      return;
    }
    const originalText = clipboard.readText();
    if (typeof originalText != "string") {
      return; //内容并非文本
    }
    if (!this.checkLength(originalText)) {
      this.setCurrentStatus(true);
      return;
    }
    const text = this.normalizeText(originalText);
    if (this.checkValid(text)) {
      this.translateWithOption({
        text,
        updateLanguage: true,
        clearResult: true,
        dict: true,
      }); //这里的text可能不是真正被翻译的
    }
  }

  normalizeText(text: string) {
    text = normalizeAppend(text, this.get<boolean>("autoPurify"));
    if (this.isWord(text)) {
      text = trimEnd(text.trim(), ",.!?. \n\r");
    }
    return text;
  }

  postProcess(language: any, result: SharedResult) {
    this.translateResult = result; //BUG FIX: 因为resultString是依赖于result的，所以要先设置一下
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
    this.sync(language);
  }

  getOptions() {
    let realOptions = 0;
    for (const [key, value] of colorRules) {
      if (key == "incrementalCopy") {
        if (this.isIncremental) {
          realOptions |= value;
        }
      } else if (this.get<boolean>(key)) {
        realOptions |= value;
      }
    }
    return realOptions;
  }

  setCurrentStatus(fail = false) {
    if (fail) {
      this.setStatus("Fail");
      return;
    }
    if (!this.get<boolean>("listenClipboard")) {
      this.setStatus("None");
      return;
    }
    const options = this.getOptions();
    const incrementalCopy = getColorRule("incrementalCopy");
    const autoCopy = getColorRule("autoCopy");
    const autoPaste = getColorRule("autoPaste");
    switch (options) {
      case incrementalCopy | autoCopy | autoPaste:
        this.setStatus("IncrementalCopyPaste");
        return;
      case incrementalCopy | autoCopy:
        this.setStatus("IncrementalCopy");
        return;
      case incrementalCopy:
        this.setStatus("Incremental");
        return;
      case autoCopy | autoPaste:
        this.setStatus("AutoPaste");
        return;
      case autoCopy:
        this.setStatus("AutoCopy");
        return;
    }
    this.setStatus("Listen");
  }

  setStatus(status: ColorStatus) {
    store.dispatch("setStatus", status);
  }

  getL(lang: Language) {
    const l = getLanguageLocales(store.getters.localeSetting);
    return l[lang];
  }

  async decideLanguage(text: string) {
    const shouldSrc = this.source;
    let destLang = this.target;
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

  //做一些判断，设置需要的输入，之后所有的都应该和text无关了
  async preTranslate(text: string) {
    this.setSrc(text);
    this.needDict = this.isWord(this.text);
  }

  async updateLanguage() {
    this.language = await this.decideLanguage(this.text);
  }

  postTranslate(
    res: SharedResult,
    language?: { source: Language; target: Language }
  ) {
    const resultString = normalizeAppend(
      res.translation,
      this.get("autoPurify")
    );
    res.translation = resultString;
    this.postProcess(language, res);
  }

  private async translateWithOption(options: TranslateOption = {}) {
    if (this.translating) {
      //保证翻译时不被打断
      return;
    }
    if (options.clearResult) {
      this.clearResult(); //在这里只清理结果，因为可能需要source做增量
    }
    this.translating = true;
    this.setStatus("Translating");

    if (options.text) {
      await this.preTranslate(options.text); //设置字体之后就不应该再使用text了
      logger.debug("tryTranslate", options.text);
    }
    if (options.updateLanguage) {
      await this.updateLanguage();
    }
    this.realTranslate(true, options.dict);
  }

  realTranslate(correct: boolean = false, dict: boolean = false) {
    if (!correct) {
      throw "incorrect call";
    }

    let tasks = [this.translateSentence()];
    if (dict && this.needDict) {
      tasks.push(this.queryDictionary());
    }

    Promise.allSettled(tasks).then(() => {
      this.translating = false;
      this.setCurrentStatus(this.translateResult == undefined);
    });
  }

  syncDict() {
    store.dispatch("setDictResult", this.dictResult);
  }

  sync(language?: { source: Language; target: Language }) {
    if (!language) {
      language = {
        source: this.source,
        target: this.target,
      };
    }
    let sharedResult: SharedResult = emptySharedResult();
    if (this.translateResult != undefined) {
      sharedResult = this.translateResult;
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

  isWord(text: string) {
    text = trimEnd(text.trim(), ",.!?. ");
    if (!this.get("smartDict") || !checkIsWord(text) || this.isIncremental) {
      return false;
    }
    return true;
  }

  async selectionQuary(text: string) {
    logger.debug(text);
  }

  async queryDictionary() {
    return this.dictionary
      .query(this.text)
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
      });
  }

  async translateSentence() {
    const language = this.language;
    if (language.source == language.target) {
      return;
    }
    const activeEngines = this.get<TranslatorType[]>("translator-enabled");
    let engines = this.get<TranslatorType[]>("translator-cache");
    if (this.get<boolean>("multiSource")) {
      engines = this.get<TranslatorType[]>("translator-compare");
    }
    engines = engines.filter((engine) => activeEngines.includes(engine));
    engines.sort();
    return this.translator
      .translate(this.text, language.source, language.target, engines)
      .then((res) => this.postTranslate(res, language))
      .catch((err) => {
        this.translateResult = undefined;
        this.sync();
        logger.error(err);
        logger.toast("翻译失败");
      });
  }

  async doubleCopyTranslate() {
    return this.checkClipboard(false);
  }

  async switchTranslator(value: TranslatorType) {
    let valid = true;
    this.translator.setMainEngine(value);

    //更新支持的语言
    this.syncSupportLanguages();

    //检查源语言是否支持
    if (!this.translator.getSupportSourceLanguages().includes(this.source)) {
      this.controller.set("sourceLanguage", "en");
      valid = false;
    }

    //检查目标语言是否支持
    if (!this.translator.getSupportTargetLanguages().includes(this.target)) {
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
        this.translateWithOption({});
      }
    } else {
      logger.debug("fallback lang");
      this.translateWithOption({ updateLanguage: true });
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
        this.clearDict();
      }
      this.syncDict();
    }
  }

  setWatch(watch: boolean) {
    if (watch) {
      clipboard.on("text-changed", () => {
        this.checkClipboard(true);
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
      this.checkClipboard(true); //第一次检查剪贴板
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
      case "multiSource":
        if (value == true) {
          this.translateWithOption();
        }
        break;
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
      case "sourceLanguage":
        this.translateWithOption({ updateLanguage: true });
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
        return true; //在这里直接返回，不要设置状态
      case "dictionaryType":
        this.switchDictionary(value as DictionaryType);
        return true; //在这里直接返回，不要设置状态
      case "baidu-ocr":
        recognizer.setUp(this.get("baidu-ocr"));
        break;
      case "pp-ocr":
        pp_recognizer.setUp(this.get("pp-ocr"));
        break;
      default:
        return false;
    }
    this.setCurrentStatus();
    return true;
  }
}

export { TranslateController };
