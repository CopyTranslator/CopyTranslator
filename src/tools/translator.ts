import { TranslatorType } from "@/core/enums";
import { GoogleLangList, GoogleCodes, GoogleLanguages } from "./languages";
import { youdao, baidu, google } from "translation.js";

abstract class Translator {
  constructor() {}
  abstract getLanglist(): [string];
  abstract lang2code(lang: string): string;
  abstract translate(
    text: string,
    src: string,
    dest: string
  ): Promise<string[] | undefined>;
  abstract detect(text: string): Promise<string | undefined>; //return lang
  onDetectError() {
    (<any>global).logger.error("检测语言失败");
  }
  onTransError() {
    (<any>global).logger.error("翻译失败");
  }
}

class GoogleTranslator extends Translator {
  getLanglist() {
    return GoogleLangList;
  }
  lang2code(lang: string) {
    return GoogleLanguages[lang];
  }
  async translate(
    text: string,
    src: string,
    dest: string
  ): Promise<string[] | undefined> {
    try {
      let result = await google.translate({
        text: text,
        from: this.lang2code(src),
        to: this.lang2code(dest)
      });
      return result.result;
    } catch (e) {
      this.onTransError();
      return undefined;
    }
  }
  async detect(text: string): Promise<string | undefined> {
    try {
      let lang = await google.detect(text);
      return lang;
    } catch (e) {
      this.onDetectError();
      return undefined;
    }
  }
}
export { Translator, GoogleTranslator };
