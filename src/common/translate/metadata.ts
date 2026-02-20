
export const builtInTranslatorMetadata: Record<string, { name: string }> = {
  baidu: { name: "百度翻译" },
  google: { name: "Google Translate" },
  keyan: { name: "Keyan" },
  youdao: { name: "有道翻译" },
  sogou: { name: "搜狗翻译" },
  caiyun: { name: "彩云小译" },
  aliyun: { name: "阿里云翻译" },
  azure: { name: "Azure Translator" },
  deepl: { name: "DeepL" },
  tencent: { name: "腾讯翻译君" },
  tencentsmart: { name: "腾讯交互翻译" },
  yandex: { name: "Yandex" },
  volc: { name: "火山翻译" },
  "baidu-domain": { name: "百度垂直领域翻译" },
  stepfun: { name: "阶跃星辰" },
  niu: { name: "小牛翻译" },
};

export function isBuiltInTranslator(id: string): boolean {
  return id in builtInTranslatorMetadata;
}
