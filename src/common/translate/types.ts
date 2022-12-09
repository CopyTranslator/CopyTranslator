import {
  TranslateResult,
  Language,
  Translator,
  Languages,
} from "@opentranslate/translator";
import { ColorStatus } from "../types";
import { TranslatorType } from "../types";

export interface SharedResult {
  text: string;
  translation: string;
  from: string;
  to: string;
  engine: string;
  transPara: string[];
  textPara: string[];
  chineseStyle: boolean;
  status?: ColorStatus;
}

export function emptySharedResult(overrides = {}): SharedResult {
  return {
    text: "",
    translation: "",
    from: "",
    to: "",
    engine: "",
    transPara: [],
    textPara: [],
    status: "None",
    chineseStyle: false,
    ...overrides,
  };
}

export interface DiffPart {
  value: string;
  added: boolean;
  removed: boolean;
}
export interface DiffParts {
  parts: Array<Array<DiffPart>>;
  engine: TranslatorType;
}

export type CopyTranslateResult = TranslateResult & {
  resultString: string;
};

export type ResultBuffer = {
  [key: string]: SharedResult;
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
