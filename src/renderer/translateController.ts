import { Compound, TranslatorType } from "../tools/translate";
import { Polymer } from "../tools/dictionary/polymer";
import { Language } from "@opentranslate/translator";
import { CopyTranslateResult } from "../tools/translate/types";
import { ColorStatus, MessageType, WinOpt } from "../tools/enums";
import { colorRules, getColorRule } from "../tools/rule";
import { normalizeAppend, checkIsWord } from "../tools/translate/helper";
import { Identifier } from "../tools/types";
import { Promisified } from "../proxy/create";
import trimEnd from "lodash.trimend";
import { Controller } from "./types";
import { createService } from "../proxy/create";
import { authorizeKey } from "../tools/types";
import { getSupportLanguages } from "../tools/translate";

import {
  DictionaryType,
  DictSuccess,
  DictFail
} from "../tools/dictionary/types";
import { clipboard } from "../tools/clipboard";
import { RendererController } from "./controller";

function constructStore(data: object) {
  var dataCopy = new Proxy(data, {
    get(target, key, receiver) {
      return Reflect.get(target, key, receiver);
    },
    set(target, key, value, receiver) {
      return Reflect.set(target, key, value, receiver);
    }
  });
}

class TranslateController {
  src: string = "";
  resultString: string = "";
  translateResult: CopyTranslateResult | undefined;
  dictResult: DictSuccess | DictFail = { words: "", valid: false };
  lastAppend: string = "";
  translator = createService<Compound>(`${authorizeKey}-translator`);
  dictionary = createService<Polymer>(`${authorizeKey}-dictionary`);
  translating: boolean = false; //正在翻译
  words: string = "";

  controller: Controller;

  getSupportLanguages() {
    return getSupportLanguages(
      RendererController.getInstance().get("translatorType")
    );
  }

  constructor(controller: Controller) {
    this.controller = controller;
  }

  get<T>(identifier: Identifier) {
    return this.controller.get(identifier) as T;
  }

  setSrc(append: string) {
    if (this.get<boolean>("incrementalCopy") && this.src != "")
      this.src = this.src + " " + append;
    else {
      this.src = append;
    }
  }

  source() {
    return this.get<Language>("sourceLanguage");
  }

  target() {
    return this.get<Language>("targetLanguage");
  }

  clear() {
    this.src = "";
    this.resultString = "";
    this.lastAppend = "";
    this.translateResult = undefined;
    this.dictResult = {
      words: "",
      valid: false
    };
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
      this.src == text ||
      this.lastAppend == text ||
      text == ""
    ) {
      return false;
    } else {
      return true;
    }
  }

  checkClipboard() {
    let originalText = clipboard.readText();
    if (!this.checkLength(originalText)) {
      this.setCurrentColor(true);
      return;
    }
    let text = this.normalizeText(originalText);
    if (this.checkValid(text)) {
      this.doTranslate(text);
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
    if (text != "") {
      if (clear) {
        this.clear();
      }
      this.doTranslate(this.normalizeText(text));
    }
  }

  dictFail(text: string) {
    this.dictResult = {
      words: text,
      valid: false
    };
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
        target: this.target()
      };
    }

    this.sendMsg(MessageType.TranslateResult, {
      src: this.src,
      result: this.resultString,
      source: language.source,
      target: language.target,
      engine: this.get<TranslatorType>("translatorType"),
      notify: this.get<boolean>("enableNotify")
    });
  }

  sendMsg(type: MessageType, extra: any) {
    console.log("send msg", type);
  }

  postProcess(language: any, result: CopyTranslateResult) {
    if (this.get<boolean>("autoCopy")) {
      clipboard.writeText(this.resultString);
      if (this.get<boolean>("autoPaste")) {
        //simulate.paste();
      }
    } else if (this.get<boolean>("autoFormat")) {
      clipboard.writeText(this.src);
    }
    if (this.get<boolean>("autoShow")) {
      // this.proxy.win.edgeShow();
      // this.proxy.win.show(
      //   !(this.get<boolean>("autoCopy") && this.get<boolean>("autoPaste"))
      // );
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
      this.switchColor(ColorStatus.Fail);
      return;
    }

    if (!this.get<boolean>("listenClipboard")) {
      this.switchColor(ColorStatus.None);
      return;
    }
    const options = this.getOptions();
    const incrementalCopy = getColorRule("incrementalCopy");
    const autoCopy = getColorRule("autoCopy");
    const autoPaste = getColorRule("autoPaste");
    switch (options) {
      case incrementalCopy | autoCopy | autoPaste:
        this.switchColor(ColorStatus.IncrementalCopyPaste);
        return;
      case incrementalCopy | autoCopy:
        this.switchColor(ColorStatus.IncrementalCopy);
        return;
      case incrementalCopy:
        this.switchColor(ColorStatus.Incremental);
        return;
      case autoCopy | autoPaste:
        this.switchColor(ColorStatus.AutoPaste);
        return;
      case autoCopy:
        this.switchColor(ColorStatus.AutoCopy);
        return;
    }
    this.switchColor(ColorStatus.Listen);
  }

  switchColor(color: ColorStatus) {
    console.log("switch color", color);
  }

  async decideLanguage(text: string) {
    let shouldSrc = this.source();
    let destLang = this.target();
    let srcLang = shouldSrc;

    if (shouldSrc !== "auto") {
      //不是自动，那么就尝试检测语言
      try {
        let detectedLang = await this.translator.detect(text);
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
      target: destLang
    };
  }

  preProcess(text: string) {
    this.lastAppend = text;
    this.setSrc(text);
    this.switchColor(ColorStatus.Translating);
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

  async doTranslate(text: string) {
    if (this.translating || !this.checkLength(text)) {
      //保证翻译时不被打断
      return;
    }
    this.translating = true;
    console.log("translate", text);

    Promise.all([
      this.translateSentence(text),
      this.queryDictionary(text)
    ]).then(() => {
      this.translating = false;
      if (this.dictResult.words === this.src && !this.dictResult.valid) {
        //同步词典结果
        this.syncDict(); //翻译完了，然后发现词典有问题，这个时候才发送
        this.setCurrentColor(true);
      } else if (this.dictResult.words !== this.src && !this.translateResult) {
        this.setCurrentColor(true);
      } else {
        this.setCurrentColor();
      }
    });
  }

  syncDict() {
    this.sendMsg(MessageType.DictResult, this.dictResult);
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

  async switchTranslator(value: TranslatorType) {
    let valid = true;
    const newEngine = await this.translator.setMainEngine(value);

    console.log(newEngine);
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
        let buffer = await this.translator.getBuffer(value);
        if (!buffer || this.translator.src !== this.src) {
          throw "no the same src";
        }
        this.postTranslate(buffer);
      } catch (e) {
        console.log("invalid");
        this.doTranslate(this.src);
      }
    } else {
      console.log("valid");
      this.doTranslate(this.src);
    }
  }

  async switchDictionary(value: DictionaryType) {
    this.dictionary.setMainEngine(value);
    if (this.src === this.dictionary.words) {
      try {
        const res = await this.dictionary.getBuffer(value);
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
        //recognizer.recognize(clipboard.readImage().toDataURL());
      });
      clipboard.startWatching();
    } else {
      clipboard.stopWatching();
    }
  }

  postSet(identifier: Identifier, value: any): boolean {
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
    return true;
  }
}

export { TranslateController };
