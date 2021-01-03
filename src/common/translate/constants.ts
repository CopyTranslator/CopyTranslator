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
}

export function emptySharedResult(): SharedResult {
  return {
    text: "",
    translation: "",
    from: "",
    to: "",
    engine: "",
    transPara: [],
    textPara: [],
    chineseStyle: false,
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

export interface SharedDiff {
  text: string;
  allParts: DiffParts[];
}

export function emptySharedDiff(): SharedDiff {
  return {
    text: "",
    allParts: [],
  };
}
