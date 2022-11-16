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

export const promiseAny = async <T>(
  iterable: Iterable<T | PromiseLike<T>>
): Promise<T> => {
  return Promise.all(
    [...iterable].map((promise) => {
      return new Promise((resolve, reject) =>
        Promise.resolve(promise).then(reject, resolve)
      );
    })
  ).then(
    (errors) => Promise.reject(errors),
    (value) => Promise.resolve<T>(value)
  );
};
