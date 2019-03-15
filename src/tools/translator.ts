import {
  BaiduCodes,
  BaiduLangList,
  BaiduLanguages,
  GoogleCodes,
  GoogleLangList,
  GoogleLanguages,
  YoudaoCodes,
  YoudaoLangList,
  YoudaoLanguages
} from "./languages";
import { MyTranslateResult, langcodes } from "./translation";
import { baidu, google, youdao } from "translation.js";
import {
  sogouTranslate,
  getSogouToken,
  SogouStorage,
  SogouSearchResult,
  sogouCodes
} from "./sogou";
const _ = require("lodash");

/*
在短时间内请求多次，会被谷歌直接封掉IP，所以上一次commit试图通过多次异步请求后组合并没有什么卵用
 */
abstract class Translator {
  abstract getLanguages(): [string];

  abstract lang2code(lang: string): string;

  abstract code2lang(code: string): string;

  abstract translate(
    text: string,
    srcCode: string,
    destCode: string
  ): Promise<MyTranslateResult | undefined>;

  abstract detect(text: string): Promise<string | undefined>; //return lang
}

class GoogleTranslator extends Translator {
  getLanguages() {
    return GoogleLangList;
  }

  lang2code(lang: string) {
    return GoogleLanguages[lang];
  }

  code2lang(code: string): string {
    return GoogleCodes[code];
  }

  async translate(
    text: string,
    srcCode: string,
    destCode: string
  ): Promise<MyTranslateResult | undefined> {
    try {
      let res: MyTranslateResult = await google.translate({
        text: text,
        from: srcCode,
        to: destCode
      });
      res.resultString = _.join(res.result, " ");
      return res;
    } catch (e) {
      (<any>global).log.debug(e);
      return undefined;
    }
  }

  async detect(text: string): Promise<string | undefined> {
    try {
      return await google.detect(text);
    } catch (e) {
      (<any>global).log.debug(e);
      return undefined;
    }
  }
}
class YoudaoTranslator extends Translator {
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
  ): Promise<MyTranslateResult | undefined> {
    try {
      let res: MyTranslateResult = await baidu.translate({
        text: text,
        from: srcCode,
        to: destCode
      });
      res.resultString = _.join(res.result, " ");
      return res;
    } catch (e) {
      (<any>global).log.debug(e);
      return undefined;
    }
  }

  async detect(text: string): Promise<string | undefined> {
    try {
      return await baidu.detect(text);
    } catch (e) {
      (<any>global).log.debug(e);
      return undefined;
    }
  }
}

class BaiduTranslator extends Translator {
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
  ): Promise<MyTranslateResult | undefined> {
    try {
      let res: MyTranslateResult = await youdao.translate({
        text: text,
        from: srcCode,
        to: destCode
      });
      res.resultString = _.join(res.result, " ");
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
class SogouTranslator extends Translator {
  sogouStorage: SogouStorage = {
    token: "b33bf8c58706155663d1ad5dba4192dc",
    tokenDate: Date.now()
  };
  constructor() {
    super();
    getSogouToken()
      .then(res => {
        this.sogouStorage.token = res;
      })
      .catch(() => "");
  }
  getLanguages() {
    return BaiduLangList;
  }

  lang2code(lang: string) {
    return BaiduLanguages[lang];
  }

  code2lang(code: string): string {
    return BaiduCodes[code];
  }
  code2sogou(code: string) {
    return BaiduCodes[code];
  }
  sogou2code(code: string) {
    return BaiduCodes[code];
  }
  async translate(
    text: string,
    srcCode: string,
    destCode: string
  ): Promise<MyTranslateResult | undefined> {
    try {
      let sogouRes: SogouSearchResult = await sogouTranslate(
        text,
        this.code2sogou(srcCode),
        this.code2sogou(destCode)
      );
      let res: MyTranslateResult = {
        text: sogouRes.result.searchText,
        raw: undefined,
        link: "",
        from: srcCode,
        to: destCode,
        resultString: sogouRes.result.trans
      };
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

export const translators = {
  sogou: SogouTranslator,
  baidu: BaiduTranslator,
  google: GoogleTranslator,
  youdao: YoudaoTranslator
};

export {
  Translator,
  GoogleTranslator,
  YoudaoTranslator,
  BaiduTranslator,
  MyTranslateResult
};
