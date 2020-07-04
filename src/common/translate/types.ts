import { TranslateResult, Language } from "@opentranslate/translator";

export type CopyTranslateResult = TranslateResult & {
  resultString: string;
};

export { TranslateResult };
export interface CopyTranslator {
  translate(
    text: string,
    from: Language,
    to: Language
  ): Promise<TranslateResult>;
  detect(text: string): Promise<Language>;
  getSupportLanguages(): Language[];
}
