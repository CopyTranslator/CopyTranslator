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

export type ResultBuffer = {
  [key: string]: SharedResult;
};
