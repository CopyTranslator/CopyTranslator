import Baidu from "@opentranslate/baidu";
import Google from "@opentranslate/google";
import Youdao from "@opentranslate/youdao";
import Sogou from "@opentranslate/sogou";
import Caiyun from "@opentranslate/caiyun";
import Tencent from "@opentranslate/tencent";
import { Translator } from "@opentranslate/translator";
import { TranslatorType } from "./types";

export const translatorMap: [TranslatorType, Translator][] = [
  ["baidu", new Baidu()],
  ["google", new Google()],
  ["youdao", new Youdao()],
  ["caiyun", new Caiyun()],
  ["sogou", new Sogou()],
  ["tencent", new Tencent()]
];
export const translators = new Map(translatorMap);

export function getTranslator(transType: TranslatorType): Translator {
  return translators.get(transType) as Translator;
}
