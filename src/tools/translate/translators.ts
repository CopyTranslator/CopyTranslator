import Baidu from "@opentranslate/baidu";
import Google from "@opentranslate/google";
import Youdao from "@opentranslate/youdao";
import Caiyun from "@opentranslate/caiyun";
import Tencent from "@opentranslate/tencent";
import { Translator } from "@opentranslate/translator";
import { TranslatorType } from "./types";
import { configs } from "./token";

export const translatorMap: [TranslatorType, Translator][] = [
  ["baidu", new Baidu({ config: configs.get("baidu") })],
  ["google", new Google({ config: configs.get("google") as any })],
  ["youdao", new Youdao({ config: configs.get("youdao") })],
  ["caiyun", new Caiyun({ config: configs.get("caiyun") })],
  ["tencent", new Tencent({ config: configs.get("tencent") } as any)]
];
export const translators = new Map(translatorMap);

export function getTranslator(transType: TranslatorType): Translator {
  return translators.get(transType) as Translator;
}
