import { getTranslator, translators, Translator } from "./translators";
import {
  TranslateResult,
  DirectionalTranslator,
  ResultBuffer,
  CopyTranslateResult,
  SharedResult,
  emptySharedResult,
} from "./types";
import { TranslatorType } from "@/common/types";
import { AxiosRequestConfig } from "axios";
import { Language } from "@opentranslate/translator";
import { autoReSegment, notEnglish } from "./helper";
import eventBus from "../event-bus";
import { getProxyAxios } from "./proxy";
import { axios } from "@/common/translate/proxy";
import { interceptTranslatorTypes } from "@/common/types";
import config from "../configuration";
import {
  Bing,
  Deepl,
  Tencent,
  InterceptTranslator,
} from "@/common/translate/intercepter";
import store from "@/store";

class ResultBufferManager {
  public resultBufferMap = new Map<TranslatorType, SharedResult | undefined>();

  engines: TranslatorType[] = [];

  clear(engines: TranslatorType[]) {
    this.engines = engines;
    this.resultBufferMap.clear();
    this.sync();
  }

  sync() {
    let resultBuffer: ResultBuffer = {};
    for (const engine of this.engines) {
      if (this.has(engine)) {
        resultBuffer[engine] = this.get(engine) as SharedResult;
      } else {
        resultBuffer[engine] = emptySharedResult({ status: "Translating" });
      }
    }
    store.dispatch("setResultBuffer", resultBuffer);
  }

  extend(engines: TranslatorType[]) {
    for (const engine of engines) {
      if (!this.engines.includes(engine)) {
        this.engines.push(engine);
      }
    }
    this.sync();
  }

  get(engine: TranslatorType) {
    return this.resultBufferMap.get(engine);
  }

  has(engine: TranslatorType) {
    return this.resultBufferMap.has(engine);
  }

  set(engine: TranslatorType, result: SharedResult) {
    if (!this.engines.includes(engine)) {
      this.engines.push(engine);
    }
    this.resultBufferMap.set(engine, result);
    this.sync();
  }
}

export class Compound {
  mainEngine: TranslatorType;
  config: AxiosRequestConfig;
  resultBuffer = new ResultBufferManager();

  text: string = "";
  from: Language = "auto";
  to: Language = "en";

  engines: TranslatorType[];
  detectEngine: TranslatorType = "baidu";

  constructor(
    engines: TranslatorType[],
    mainEngine: TranslatorType = "google",
    config: AxiosRequestConfig = {}
  ) {
    this.engines = engines;
    this.mainEngine = mainEngine;
    this.config = config;
  }

  setUpGoogleOrigin() {
    let googleMirror = config.get<string | undefined>("googleMirror");
    if (googleMirror != undefined) {
      if (googleMirror.endsWith("/")) {
        googleMirror = googleMirror.substring(0, googleMirror.length - 1);
      }
      if (googleMirror.length == 0) {
        googleMirror = undefined;
      }
    }
    const oldTranslator = translators.get("google") as Translator;
    const TranslatorClass: any = oldTranslator.constructor;
    const newTranslator = new TranslatorClass({
      axios: getProxyAxios(true, googleMirror),
      config: oldTranslator.config,
    });
    translators.set("google", newTranslator);
  }

  initialize() {
    return this.postSetEngines();
  }

  onExit() {
    this.engines = []; //关闭所有intercepter引擎
    return this.postSetEngines();
  }

  postSetEngines() {
    this.setUpGoogleOrigin();
    //关闭和启动intercepter引擎以节省资源
    let debug = false;
    debug = debug && process.env.NODE_ENV != "production";
    const engine2Class = {
      bing: Bing,
      deepl: Deepl,
      tencent: Tencent,
    };
    const engineObjs = [];
    for (const engine of interceptTranslatorTypes) {
      if (this.engines.includes(engine) && !translators.has(engine)) {
        //没有启动
        const engineObj = new engine2Class[engine]({
          axios,
          config: { debug: debug },
        });
        translators.set(engine, engineObj);
        engineObjs.push(engineObj);
      } else if (!this.engines.includes(engine) && translators.has(engine)) {
        (<InterceptTranslator>translators.get(engine)).destory();
        //关闭引擎
        translators.delete(engine);
        console.log("shutdown", engine);
      }
    }
    if (engineObjs.length != 0) {
      return Promise.allSettled(engineObjs.map((obj) => obj.restart()));
    }
    return Promise.resolve(true);
  }

  setEngines(engines: TranslatorType[]) {
    this.engines = engines;
    if (!this.engines.includes(this.mainEngine)) {
      eventBus.at("dispatch", "translatorType", this.engines[0]);
    }
    return this.postSetEngines();
  }

  getMainEngine() {
    return getTranslator(this.mainEngine);
  }

  isSupport(engineName: TranslatorType, from: Language, to: Language): boolean {
    const engine = getTranslator(engineName);
    if (engine instanceof DirectionalTranslator) {
      return engine.isSupport(from, to);
    } else {
      const supportLanguages = engine.getSupportLanguages();
      return supportLanguages.includes(from) && supportLanguages.includes(to);
    }
  }

  async translate(
    text: string,
    from: Language,
    to: Language,
    engines?: TranslatorType[]
  ): Promise<SharedResult> {
    if (!engines) {
      engines = [...this.engines];
    }
    const fallbackEngine = config.get("fallbackTranslator") as TranslatorType;
    let mainEngine = this.mainEngine;
    if (!engines.includes(this.mainEngine)) {
      engines.push(this.mainEngine);
    } //这里肯定是要有mainEngine

    const supportEngines = engines.filter((engine) => {
      const support = this.isSupport(engine, from, to);
      return support;
    });
    if (!supportEngines.includes(this.mainEngine)) {
      mainEngine = fallbackEngine;
    } //如果主引擎不支持的话，就切换到副引擎
    if (this.text === text && this.from === from && this.to === to) {
      this.resultBuffer.extend(supportEngines);
    } else {
      this.resultBuffer.clear(supportEngines);
      this.text = text;
      this.from = from;
      this.to = to;
    }
    //先清空缓存
    const mainResult = this.translateWith(mainEngine, text, from, to);
    for (const name of supportEngines) {
      if (name === mainEngine) {
        continue;
      }
      const engine = getTranslator(name);
      if (
        engine instanceof DirectionalTranslator &&
        !engine.isSupport(from, to)
      ) {
        console.log(name, "不支持", from, "to", to);
        continue;
      } else {
        this.translateWith(name, text, from, to).catch((err: any) => {
          console.log(name, "translate error", err);
        }); //这里catch一下就好了
      }
    }
    return mainResult;
  }

  async translateWith(
    engine: TranslatorType,
    text: string,
    from: Language,
    to: Language
  ): Promise<SharedResult> {
    if (this.resultBuffer.has(engine)) {
      //如果已经有缓存了,直接返回就行了
      return Promise.resolve(this.resultBuffer.get(engine) as SharedResult);
    }
    return getTranslator(engine)
      .translate(text, from, to, this.config)
      .then((res: TranslateResult) => {
        res.engine = engine; //防止res.engine值不一样
        return res;
      })
      .then(autoReSegment)
      .then((result: CopyTranslateResult) => {
        return {
          text: result.text,
          translation: result.resultString,
          from: result.from,
          to: result.to,
          engine: result.engine,
          transPara: result.trans.paragraphs,
          textPara: result.origin.paragraphs,
          chineseStyle: notEnglish(result.to),
        };
      })
      .then((res: SharedResult) => {
        this.resultBuffer.set(engine, res);
        return res;
      });
  }

  detect(text: string) {
    return getTranslator(this.detectEngine).detect(text);
  }

  getBuffer(engine: TranslatorType) {
    return this.resultBuffer.get(engine);
  }

  setMainEngine(engineType: TranslatorType) {
    this.mainEngine = engineType;
  }

  getSupportLanguages(): Language[] {
    throw "This method should not be used.";
  }

  getSupportSourceLanguages(): Language[] {
    const mainEngine = this.getMainEngine();
    if (mainEngine instanceof DirectionalTranslator) {
      return mainEngine.getSupportSourceLanguages();
    } else {
      return mainEngine.getSupportLanguages();
    }
  }

  getSupportTargetLanguages(): Language[] {
    const mainEngine = this.getMainEngine();
    if (mainEngine instanceof DirectionalTranslator) {
      return mainEngine.getSupportTargetLanguages();
    } else {
      return mainEngine.getSupportLanguages();
    }
  }
}
