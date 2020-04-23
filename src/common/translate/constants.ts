export const translatorTypes = [
  "baidu",
  "google",
  "sogou",
  "caiyun",
  "tencent",
  "youdao",
] as const;
export type TranslatorType = typeof translatorTypes[number];

export interface SharedResult {
  text: string;
  translation: string;
  from: string;
  to: string;
  engine: string;
  notify: boolean;
}

export function emptySharedResult(): SharedResult {
  return {
    text: "",
    translation: "",
    from: "",
    to: "",
    engine: "",
    notify: false,
  };
}
