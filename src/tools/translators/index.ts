import Baidu from "@opentranslate/baidu";
import { Translator } from "@opentranslate/translator";
export const translatorTypes = [
  "Baidu",
  "Caiyun",
  "Google",
  "Youdao",
  "Sogou"
] as const;
export type TranslatorType = (typeof translatorTypes)[number];
type TranslatorConstructor = { new (): Translator };
const translatorMap: [TranslatorType, TranslatorConstructor][] = [
  ["Baidu", Baidu],
  ["Google", Baidu],
  ["Youdao", Baidu],
  ["Caiyun", Baidu],
  ["Sogou", Baidu]
];
const translators = new Map(translatorMap);

export function getTranslator(
  transType: TranslatorType
): TranslatorConstructor {
  return <TranslatorConstructor>translators.get(transType);
}

export function createTranslator(transType: TranslatorType): Translator {
  return new (getTranslator(transType))();
}
