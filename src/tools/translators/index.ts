import Baidu from "@opentranslate/baidu";
import { Translator } from "@opentranslate/translator";
export const translatorTypes = ["Baidu", "Caiyun", "Google", "Youdao", "Sogou"];
export type TranslatorType = (typeof translatorTypes)[number];

const translatorMap: [TranslatorType, Translator][] = [
  ["Baidu", new Baidu()],
  ["Google", new Baidu()],
  ["Youdao", new Baidu()],
  ["Caiyun", new Baidu()],
  ["Sogou", new Baidu()]
];
export const translators = new Map(translatorMap);
