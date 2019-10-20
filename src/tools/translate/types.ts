import {
  Translator,
  TranslateResult,
  Language
} from "@opentranslate/translator";

export type CopyTranslateResult = TranslateResult & { resultString: string };
export { TranslateResult };
export const translatorTypes = [
  "baidu",
  "caiyun",
  "google",
  "youdao",
  "sogou",
  "tencent"
] as const;
export type TranslatorType = (typeof translatorTypes)[number];
export interface CopyTranslator {
  translate(
    text: string,
    from: Language,
    to: Language
  ): Promise<TranslateResult>;
  detect(text: string): Promise<Language>;
  getSupportLanguages(): Language[];
}
