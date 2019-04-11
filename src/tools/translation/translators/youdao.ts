import { CommonTranslateResult, Translator, Dict, reSegment } from "..";
import { youdao } from "copy-translation.js";
const _ = require("lodash");
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
const YoudaoCodes = _.invert(YoudaoLanguages);
const YoudaoLangList = _.keys(YoudaoLanguages);

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
      res.resultString = reSegment(text, <string[]>res.result, destCode);
      return res;
    } catch (e) {
      (<any>global).log.debug(e);
      return undefined;
    }
  }

  async detect(text: string): Promise<string | undefined> {
    try {
      return await youdao.detect(text);
    } catch (e) {
      (<any>global).log.debug(e);
      return undefined;
    }
  }
}
