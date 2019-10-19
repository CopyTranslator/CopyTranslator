import Baidu from "@opentranslate/baidu";
import Google from "@opentranslate/google";
import Youdao from "@opentranslate/youdao";
import Sogou from "@opentranslate/sogou";
import Caiyun from "@opentranslate/caiyun";
import Tencent from "@opentranslate/tencent";
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
  "baidu",
  "caiyun",
  "google",
  "youdao",
  "sogou",
  "tencent"
] as const;
export type TranslatorType = (typeof translatorTypes)[number];
// type TranslatorConstructor = { new (): Translator };
export const translatorMap: [TranslatorType, Translator][] = [
  ["baidu", new Baidu()],
  ["google", new Google()],
  ["youdao", new Youdao()],
  ["caiyun", new Caiyun()],
  ["sogou", new Sogou()],
  ["tencent", new Tencent()]
];
export const translators = new Map(translatorMap);

export function createTranslator(transType: TranslatorType): Translator {
  return translators.get(transType) as Translator;
}
