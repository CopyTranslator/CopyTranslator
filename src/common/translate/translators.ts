import { Translator, Language } from "./types";
import { Baidu } from "@opentranslate/baidu";
import { GoogleWrapper } from "./google-wrapper";
import { Youdao } from "@opentranslate2/youdao";
import { Caiyun } from "@opentranslate/caiyun";
import { Niu} from "@opentranslate2/niu";
// import { Tencent } from "@opentranslate/tencent";
import { Sogou } from "@opentranslate2/sogou";
import { BaiduDomain } from "@opentranslate2/baidu-domain";
import { TranslatorType } from "@/common/types";
import { defaultTokens } from "./token";
import { axios } from "./proxy";
import config from "../configuration";
import { keyan } from "./keyan";
import { Stepfun } from "./stepfun";
import { customTranslatorManager } from "./custom-translators";
import {detectLang} from "@opentranslate2/translator/dist/detect-lang"

export {detectLang};

export const translatorMap: [TranslatorType, Translator][] = [
  ["baidu", new Baidu({ axios, config: defaultTokens.get("baidu") })],
  ["google", new GoogleWrapper({ axios, config: defaultTokens.get("google") })],
  ["keyan", keyan],
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
  ["stepfun", new Stepfun({ axios, config: defaultTokens.get("stepfun") })],
  ["niu", new Niu({ axios, config: defaultTokens.get("niu") })],
];

export const translators = new Map(translatorMap);

/**
 * 获取翻译器实例（支持内置翻译器和自定义翻译器）
 */
export function getTranslator(transType: TranslatorType | string): Translator {
  
  // 首先尝试从内置翻译器中获取
  const builtinTranslator = translators.get(transType as TranslatorType);
  if (builtinTranslator) {
    return builtinTranslator;
  }
  
  // 如果不是内置翻译器，尝试从自定义翻译器中获取
  const customTranslator = customTranslatorManager.getTranslator(transType);
  if (customTranslator) {
    return customTranslator;
  }
  
  // 如果都找不到，返回默认的 Google 翻译器
  console.warn(`翻译器 "${transType}" 未找到，使用 Google 作为后备`);
  return translators.get("google") as Translator;
}

/**
 * 检查翻译器是否存在
 */
export function hasTranslator(transType: string): boolean {
  return translators.has(transType as TranslatorType) || 
         customTranslatorManager.isCustomTranslator(transType);
}

/**
 * 获取所有可用的翻译器 ID（包括内置和自定义）
 */
export function getAllTranslatorIds(): string[] {
  const builtinIds = Array.from(translators.keys());
  const customIds = customTranslatorManager.getAllIds();
  return [...builtinIds, ...customIds];
}
/**
 * 获取翻译器支持的语言列表
 */
export function getSupportLanguages(type: TranslatorType | string): Language[] {
  return getTranslator(type).getSupportLanguages();
}

export { Translator, Language };
