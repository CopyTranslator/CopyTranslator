import { SogouTranslator } from "./sogou";
import { YoudaoTranslator } from "./youdao";
import { BaiduTranslator } from "./baidu";
import { GoogleTranslator } from "./google";
import { CaiyunTranslator } from "./caiyun";
const _ = require("lodash");
export enum TranslatorType {
  Google,
  Youdao,
  Baidu,
  Sogou,
  Caiyun
}

export const translators: { [key: string]: any } = {
  sogou: SogouTranslator,
  baidu: BaiduTranslator,
  google: GoogleTranslator,
  youdao: YoudaoTranslator,
  caiyun: CaiyunTranslator
};

export const translatorNames: Array<string> = Object.values(TranslatorType)
  .filter(k => (typeof k as any) != "number")
  .map(_.toLower);
