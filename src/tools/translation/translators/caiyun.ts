require("isomorphic-fetch");
import { CommonTranslateResult, Translator, Dict, reSegment } from "..";
const _ = require("lodash");
import { BaiduTranslator, BaiduCodes } from "./baidu";
import { sentenceEnds } from "../../../core/stringProcessor";
const CaiyunLanguages: Dict = {
  Japanese: "ja",
  English: "en",
  "Chinese(Simplified)": "zh-CN"
};

const caiyun2code: Dict = {
  zh: "zh-CN",
  en: "en",
  ja: "ja"
};

const code2caiyun = _.invert(caiyun2code);
const CaiyunCodes = _.invert(CaiyunLanguages);
const CaiyunLangList = _.keys(CaiyunLanguages);
const TOKEN = "3975l6lr5pcbvidl6jl2";

async function CaiyunTranslate(
  text: string,
  srcCode: string,
  destCode: string
): Promise<CommonTranslateResult | undefined> {
  let source = text.split(sentenceEnds);
  const payload = {
    source: source,
    trans_type: `${code2caiyun[srcCode]}2${code2caiyun[destCode]}`,
    request_id: "demo"
  };
  try {
    let res = await fetch("http://api.interpreter.caiyunai.com/v1/translator", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-authorization": "token " + TOKEN
      },
      body: JSON.stringify(payload)
    });
    const json = await res.json();
    return {
      text: text,
      result: json.target,
      resultString: reSegment(text, <string[]>json.target),
      raw: undefined,
      link: "",
      from: srcCode,
      to: destCode
    };
  } catch (e) {
    return undefined;
  }
}

export class CaiyunTranslator extends Translator {
  detector: Translator = new BaiduTranslator();
  getLanguages() {
    return CaiyunLangList;
  }

  lang2code(lang: string) {
    return CaiyunLanguages[lang];
  }

  code2lang(code: string): string {
    return CaiyunCodes[code];
  }

  async translate(
    text: string,
    srcCode: string,
    destCode: string
  ): Promise<CommonTranslateResult | undefined> {
    try {
      let res = await CaiyunTranslate(text, srcCode, destCode);
      return res;
    } catch (e) {
      (<any>global).log.debug(e);
      return undefined;
    }
  }

  async detect(text: string): Promise<string | undefined> {
    try {
      const lang = await this.detector.detect(text);
      if (_.includes(CaiyunLangList, BaiduCodes[<string>lang])) {
        return lang;
      } else {
        throw "language not found";
      }
    } catch (e) {
      return undefined;
    }
  }
}
