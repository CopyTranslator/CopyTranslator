import { CommonTranslateResult, Translator, Dict, reSegment } from "./helper";
import { youdao } from "translation.js";
import invert from "lodash.invert";

const YoudaoLanguages: Dict = {
  English: "en",
  Russian: "ru",
  Portuguese: "pt",
  Spanish: "es",
  "Chinese(Simplified)": "zh-CN",
  Japanese: "ja",
  Korean: "ko",
  French: "fr"
};
const YoudaoCodes = invert(YoudaoLanguages);
const YoudaoLangList = Object.keys(YoudaoLanguages);

export class YoudaoTranslator extends Translator {
  getLanguages() {
    return YoudaoLangList;
  }

  lang2code(lang: string) {
    return YoudaoLanguages[lang];
  }

  code2lang(code: string): string {
    return YoudaoCodes[code];
  }

  async translate(
    text: string,
    srcCode: string,
    destCode: string
  ): Promise<CommonTranslateResult | undefined> {
    try {
      let res: CommonTranslateResult = await youdao.translate({
        text: text,
        from: srcCode,
        to: destCode
      });
      res.resultString = reSegment(
        text,
        <string[]>res.result,
        srcCode,
        destCode
      );
      return res;
    } catch (e) {
      console.log(e);
      return undefined;
    }
  }

  async detect(text: string): Promise<string | undefined> {
    try {
      return await youdao.detect(text);
    } catch (e) {
      console.log(e);
      return undefined;
    }
  }
}
