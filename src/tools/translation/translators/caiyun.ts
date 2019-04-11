require("isomorphic-fetch");
import {
  CommonTranslateResult,
  Translator,
  Dict,
  reSegment,
  chnEnds,
  engEnds,
  notEnglish,
  chnBreaks,
  engBreaks
} from "..";
const _ = require("lodash");
import { BaiduTranslator, BaiduCodes } from "./baidu";
import { RuleName } from "../../rule";
import { Controller } from "../../../core/controller";

const CaiyunLanguages: Dict = {
  Japanese: "ja",
  English: "en",
  "Chinese(Simplified)": "zh-CN"
};

const code2caiyun: Dict = {
  "zh-CN": "zh",
  en: "en",
  ja: "ja"
};

const CaiyunCodes = _.invert(CaiyunLanguages);
const CaiyunLangList = _.keys(CaiyunLanguages);
const TOKEN = "3975l6lr5pcbvidl6jl2";

async function CaiyunTranslate(
  text: string,
  srcCode: string,
  destCode: string
): Promise<CommonTranslateResult | undefined> {
  const noEng = notEnglish(srcCode);
  let source: string[] = [];
  // if ((<Controller>(<any>global).controller).get(RuleName.autoPurify)) {
  //   source = text.split(noEng ? chnEnds : engEnds);
  // } else {
  //   source = text.split(noEng ? chnBreaks : engBreaks);
  // }
  source = text.split("\n");
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
      resultString: _.join(json.target, "\n"),
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
