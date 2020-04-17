import { getTranslator, translators } from "./translators";
import { TranslatorType, CopyTranslator, CopyTranslateResult } from "./types";
import { AxiosRequestConfig } from "axios";
import {
  Language,
  TranslateResult,
  Translator
} from "@opentranslate/translator";
import { autoReSegment } from "./helper";
import { translatorTypes } from "./constants";

export class Compound implements CopyTranslator {
  mainEngine: Translator;
  axios = null;
  config: AxiosRequestConfig;
  languages: Language[];
  resultBuffer = new Map<TranslatorType, TranslateResult | undefined>();
  src: string | undefined;

  constructor(
    engineType: TranslatorType = "google",
    config: AxiosRequestConfig = {}
  ) {
    this.mainEngine = getTranslator(engineType);
    this.languages = this.mainEngine.getSupportLanguages();
    this.config = config;
  }

  translate(
    text: string,
    from: Language,
    to: Language
  ): Promise<CopyTranslateResult> {
    this.src = text;
    for (const [name, translator] of translators.entries()) {
      if (name === this.mainEngine.name) {
        continue;
      }
      translator
        .translate(text, from, to, this.config)
        .then(autoReSegment)
        .then(res => {
          this.resultBuffer.set(res.engine as TranslatorType, res);
        })
        .catch(() => {
          this.resultBuffer.set(translator.name as TranslatorType, undefined);
        });
    }
    this.resultBuffer.set(this.mainEngine.name as TranslatorType, undefined);
    return this.mainEngine
      .translate(text, from, to, this.config)
      .then(autoReSegment)
      .then(res => {
        this.resultBuffer.set(res.engine as TranslatorType, res);
        return res;
      });
  }

  detect(text: string) {
    return this.mainEngine.detect(text);
  }

  getBuffer(engine: TranslatorType) {
    return this.resultBuffer.get(engine) as CopyTranslateResult;
  }

  setMainEngine(engineType: TranslatorType) {
    this.mainEngine = getTranslator(engineType);
  }

  getSupportLanguages(): Language[] {
    return this.mainEngine.getSupportLanguages();
  }

  isValid(lang: Language): boolean {
    return this.languages.includes(lang);
  }
}
