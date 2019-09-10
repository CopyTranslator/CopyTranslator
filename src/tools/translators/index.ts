import { SogouTranslator } from "./sogou";
import { YoudaoTranslator } from "./youdao";
import { BaiduTranslator } from "./baidu";
import { GoogleTranslator } from "./google";
import { CaiyunTranslator } from "./caiyun";
import * as _ from "lodash";

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
  .filter((x): x is string => typeof x == "string")
  .map(_.toLower);
