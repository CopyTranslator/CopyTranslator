import { TranslatorType, createTranslator, translatorMap } from "./types";
import { AxiosRequestConfig } from "axios";
import { Language, TranslateResult } from "@opentranslate/translator";
class Compound {
  currentEngine: TranslatorType = "google";
  config: AxiosRequestConfig = {};
  resultBuffer = new Map<TranslatorType, TranslateResult>();
  query(text: string, from: Language, to: Language) {
    createTranslator(this.currentEngine)
      .translate(text, from, to, this.config)
      .then(Promise.resolve);
    translatorMap.map(item => {
      if (item[0] === this.currentEngine) {
        return;
      }
      item[1].translate(text, from, to, this.config).then(res => {
        this.resultBuffer.set(res.engine as TranslatorType, res);
      });
    });
  }
}
