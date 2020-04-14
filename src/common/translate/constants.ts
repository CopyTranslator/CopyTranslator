export const translatorTypes = [
  "baidu",
  "google",
  "sogou",
  "caiyun",
  "tencent",
  "youdao"
] as const;
export type TranslatorType = typeof translatorTypes[number];
