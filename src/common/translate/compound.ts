import { getTranslator, translators, Translator } from "./translators";
import {
  CopyTranslator,
  CopyTranslateResult,
  TranslateResult,
  DirectionalTranslator,
} from "./types";
import { TranslatorType } from "@/common/types";
import { AxiosRequestConfig } from "axios";
import { Language } from "@opentranslate/translator";
import { autoReSegment } from "./helper";
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

export class Compound implements CopyTranslator {
  mainEngine: TranslatorType;
  config: AxiosRequestConfig;
  running: number = 0;
  resultBuffer = new Map<TranslatorType, CopyTranslateResult | undefined>();
  text: string | undefined;
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
    if (
      engine instanceof DirectionalTranslator &&
      !engine.isSupport(from, to)
    ) {
      return false;
    } else {
      return true;
    }
  }

  async translate(
    text: string,
    from: Language,
    to: Language,
    engines?: TranslatorType[]
  ): Promise<CopyTranslateResult> {
    this.text = text;
    if (!engines) {
      engines = this.engines;
    }
    this.resultBuffer.clear(); //先清空缓存
    const fallbackEngine = config.get("fallbackTranslator") as TranslatorType;
    const mainEngine = this.isSupport(this.mainEngine, from, to)
      ? this.mainEngine
      : fallbackEngine; //如果主引擎不支持的话，就切换到副引擎
    const mainResult = this.translateWith(mainEngine, text, from, to);
    for (const name of engines) {
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
        this.translateWith(name, text, from, to);
      }
    }
    return mainResult;
  }

  async onAllTranslateFinish() {
    eventBus.at("allTranslated", this.resultBuffer);
  }

  async translateWith(
    engine: TranslatorType,
    text: string,
    from: Language,
    to: Language
  ): Promise<CopyTranslateResult> {
    this.resultBuffer.delete(engine);
    this.running++;
    return getTranslator(engine)
      .translate(text, from, to, this.config)
      .then((res: TranslateResult) => {
        res.engine = engine; //防止res.engine值不一样
        return res;
      })
      .then(autoReSegment)
      .then((res: any) => {
        this.resultBuffer.set(engine, res);
        return res;
      })
      .catch((err: any) => {
        console.log(engine, "translate error", err);
        return null;
      })
      .then((res: any) => {
        if (--this.running == 0) {
          this.onAllTranslateFinish();
        }
        if (res == null) {
          if (engine == this.mainEngine) {
            throw "TRANSLATE ERROR";
          }
        } else {
          return res;
        }
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
