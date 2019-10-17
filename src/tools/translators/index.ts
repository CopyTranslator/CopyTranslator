import Baidu from "@opentranslate/baidu";
import Google from "@opentranslate/google";
import Youdao from "@opentranslate/youdao";
import Sogou from "@opentranslate/sogou";
import Caiyun from "@opentranslate/caiyun";
import { Translator, TranslateResult } from "@opentranslate/translator";
import { reSegment, reSegmentGoogle } from "./helper";
export { TranslateResult };
export type CopyTranslateResult = TranslateResult & { resultString: string };

export function autoReSegment(result: TranslateResult): CopyTranslateResult {
  let segmentFunc = reSegment;
  if (result.engine == "google") {
    segmentFunc = reSegmentGoogle;
  }
  const resultString = segmentFunc(
    result.text,
    result.trans.paragraphs,
    result.from,
    result.to
  );
  return { ...result, resultString };
}

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
  ["Google", Google],
  ["Youdao", Youdao],
  ["Caiyun", Caiyun],
  ["Sogou", Sogou]
];
const translators = new Map(translatorMap);

export function getTranslator(
  transType: TranslatorType
): TranslatorConstructor {
  return translators.get(transType) as TranslatorConstructor;
}

export function createTranslator(transType: TranslatorType): Translator {
  return new (getTranslator(transType))();
}
