import { Translator, Language } from "@opentranslate/translator";
import { Baidu } from "@opentranslate/baidu";
import { Google } from "@opentranslate/google";
import { Youdao } from "@opentranslate/youdao";
import { Caiyun } from "@opentranslate/caiyun";
// import { Tencent } from "@opentranslate/tencent";
import { Sogou } from "@opentranslate/sogou";
import { BaiduDomain } from "@opentranslate/baidu-domain";
import { TranslatorType, GoogleSource } from "@/common/types";
import { defaultTokens } from "./token";
import { axios } from "./proxy";
import { Simply } from "./simply";
import config from "../configuration";
import { keyan } from "./keyan";
import { lingva } from "./lingva";

export const translatorMap: [TranslatorType | GoogleSource, Translator][] = [
  ["baidu", new Baidu({ axios, config: defaultTokens.get("baidu") })],
  ["google", new Google({ axios, config: defaultTokens.get("google") })],
  [
    "simply",
    new Simply({
      axios,
      config: { URL: "https://simplytranslate.org" },
    }),
  ],
  ["keyan", keyan],
  ["lingva", lingva],
  ["youdao", new Youdao({ axios, config: defaultTokens.get("youdao") })],
  ["sogou", new Sogou({ axios, config: defaultTokens.get("sogou") })],
  ["caiyun", new Caiyun({ axios, config: defaultTokens.get("caiyun") })],
  // ["tencent", new Tencent({ axios, config: defaultTokens.get("tencent") })],
  [
    "baidu-domain",
    new BaiduDomain({
      axios,
      config: {
        ...defaultTokens.get("baidu-domain"),
        domain: "medicine",
      },
    }) as any,
  ],
];

export const translators = new Map(translatorMap);

export function getTranslator(transType: TranslatorType): Translator {
  if (transType == "google") {
    transType = config.get("googleSource");
  }
  return translators.get(transType) as Translator;
}
export function getSupportLanguages(type: TranslatorType): Language[] {
  return getTranslator(type).getSupportLanguages();
}

export { Translator };
