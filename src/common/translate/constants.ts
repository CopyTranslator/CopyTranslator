export interface SharedResult {
  text: string;
  translation: string;
  from: string;
  to: string;
  engine: string;
  transPara: string[];
  textPara: string[];
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
  };
}
