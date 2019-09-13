import { SogouTranslator } from "./sogou";
import { YoudaoTranslator } from "./youdao";
import { BaiduTranslator } from "./baidu";
import { GoogleTranslator } from "./google";
import { CaiyunTranslator } from "./caiyun";
import { Dict } from "../dict";
import _ from "lodash";

export enum TranslatorType {
  Google = "Google",
  Youdao = "Youdao",
  Baidu = "Baidu",
  Sogou = "Sogou",
  Caiyun = "Caiyun"
}

const translatorDict = Dict([
  [TranslatorType.Google, new GoogleTranslator()],
  [TranslatorType.Youdao, new YoudaoTranslator()],
  [TranslatorType.Baidu, new BaiduTranslator()],
  [TranslatorType.Sogou, new SogouTranslator()],
  [TranslatorType.Caiyun, new CaiyunTranslator()]
]);
export const getTranslator = translatorDict.getFunc;
export const translatorRange = translatorDict.range;

export const translatorNames = translatorRange;
