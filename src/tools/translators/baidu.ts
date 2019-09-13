import { CommonTranslateResult, Translator, Dict, reSegment } from "./helper";
import { baidu } from "translation.js";

import invert from "lodash.invert";
export const BaiduLanguages: Dict = {
  English: "en",
  Thai: "th",
  Russian: "ru",
  Portuguese: "pt",
  Greek: "el",
  Dutch: "nl",
  Polish: "pl",
  Bulgarian: "bg",
  Estonian: "et",
  Danish: "da",
  Finnish: "fi",
  Czech: "cs",
  Romanian: "ro",
  Slovenian: "sl",
  Swedish: "sv",
  Hungarian: "hu",
  German: "de",
  Italian: "it",
  "Chinese(Simplified)": "zh-CN",
  "Chinese(Traditional)": "zh-TW",
  Japanese: "ja",
  Korean: "ko",
  Spanish: "es",
  French: "fr",
  Arabic: "ar"
};

export const BaiduCodes = invert(BaiduLanguages);
const BaiduLangList = Object.keys(BaiduLanguages);

export class BaiduTranslator extends Translator {
  getLanguages() {
    return BaiduLangList;
  }

  lang2code(lang: string) {
    return BaiduLanguages[lang];
  }

  code2lang(code: string): string {
    return BaiduCodes[code];
  }

  async translate(
    text: string,
    srcCode: string,
    destCode: string
  ): Promise<CommonTranslateResult | undefined> {
    try {
      let res: CommonTranslateResult = await baidu.translate({
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
      return await baidu.detect(text);
    } catch (e) {
      console.log(e);
      return undefined;
    }
  }
}
