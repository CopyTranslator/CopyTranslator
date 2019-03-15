import { SogouTranslator } from "./sogou";
import { YoudaoTranslator } from "./youdao";
import { BaiduTranslator } from "./baidu";
import { GoogleTranslator } from "./google";

export enum TranslatorType {
  Google,
  Youdao,
  Baidu,
  Sogou
}
export const translators: { [key: string]: any } = {
  sogou: SogouTranslator,
  baidu: BaiduTranslator,
  google: GoogleTranslator,
  youdao: YoudaoTranslator
};
