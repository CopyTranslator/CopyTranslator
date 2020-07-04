import { getTranslator } from "./translators";
import { CopyTranslator, CopyTranslateResult } from "./types";
import { TranslatorType } from "@/common/types";
import { AxiosRequestConfig } from "axios";
import { Language } from "@opentranslate/translator";
import { autoReSegment } from "./helper";
import { setProxy } from "./proxy";
import eventBus from "../event-bus";

export class Compound implements CopyTranslator {
  mainEngine: TranslatorType;
  config: AxiosRequestConfig;
  resultBuffer = new Map<TranslatorType, CopyTranslateResult | undefined>();
  text: string | undefined;
  engines: TranslatorType[];
  detectEngine: TranslatorType = "google";
  axios = setProxy();

  constructor(
    engines: TranslatorType[],
    mainEngine: TranslatorType = "google",
    config: AxiosRequestConfig = {}
  ) {
    this.engines = engines;
    this.mainEngine = mainEngine;
    this.config = config;
  }

  setEngines(engines: TranslatorType[]) {
    this.engines = engines;
    if (!this.engines.includes(this.mainEngine)) {
      eventBus.at("dispatch", "translatorType", this.engines[0]);
    }
  }

  getMainEngine() {
    return getTranslator(this.mainEngine);
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
    for (const name of engines) {
      if (name === this.mainEngine) {
        continue;
      }
      this.translateWith(name, text, from, to).catch((e) => {
        console.debug(name, "translate error", e);
      });
    }
    return this.translateWith(this.mainEngine, text, from, to);
  }

  async translateWith(
    engine: TranslatorType,
    text: string,
    from: Language,
    to: Language
  ): Promise<CopyTranslateResult> {
    this.resultBuffer.delete(engine);
    return getTranslator(engine)
      .translate(text, from, to, this.config)
      .then(autoReSegment)
      .then((res) => {
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
    return this.getMainEngine().getSupportLanguages();
  }

  isValid(lang: Language): boolean {
    return this.getMainEngine().getSupportLanguages().includes(lang);
  }
}
