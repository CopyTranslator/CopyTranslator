import { TranslateResult, Language } from "@opentranslate/translator";
import { DictResult } from "../dictionary/types";

export type CopyTranslateResult = TranslateResult & {
  resultString: string;
  dict?: DictResult;
};

export { TranslateResult };
export * from "./constants";
export interface CopyTranslator {
  translate(
    text: string,
    from: Language,
    to: Language
  ): Promise<TranslateResult>;
  detect(text: string): Promise<Language>;
  getSupportLanguages(): Language[];
}
