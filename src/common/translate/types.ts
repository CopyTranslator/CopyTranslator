import {
  TranslateResult,
  Language,
  Translator,
  Languages,
} from "@opentranslate/translator";

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

export abstract class DirectionalTranslator<
  Config extends {}
> extends Translator<Config> {
  getSupportLanguages(): Languages {
    throw "This method should not be used for DirectionalTranslator.";
  }
  abstract getSupportSourceLanguages(): Language[];
  abstract getSupportTargetLanguages(): Language[];
  abstract isSupport(from: Language, to: Language): boolean;
}
