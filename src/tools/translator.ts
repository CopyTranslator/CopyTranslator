import { TranslatorType } from "./enums";
import { GoogleLangList, GoogleCodes, GoogleLanguages } from "./languages";
import { youdao, baidu, google } from "translation.js";
var _ = require("lodash");

abstract class Translator {
  constructor() {}
  abstract getLangList(): [string];
  abstract lang2code(lang: string): string;
  abstract translate(
    text: string,
    src: string,
    dest: string
  ): Promise<string | undefined>;
  abstract detect(text: string): Promise<string | undefined>; //return lang
}

class GoogleTranslator extends Translator {
  getLangList() {
    return GoogleLangList;
  }
  lang2code(lang: string) {
    return GoogleLanguages[lang];
  }
  async translate(
    text: string,
    src: string,
    dest: string
  ): Promise<string | undefined> {
    try {
      let result = await google.translate({
        text: text,
        from: this.lang2code(src),
        to: this.lang2code(dest)
      });
      return _.join(result.result, " ");
    } catch (e) {
      (<any>global).log.debug(e);
      return undefined;
    }
  }
  async detect(text: string): Promise<string | undefined> {
    try {
      let lang = await google.detect(text);
      return lang;
    } catch (e) {
      (<any>global).log.debug(e);
      return undefined;
    }
  }
}
export { Translator, GoogleTranslator };
