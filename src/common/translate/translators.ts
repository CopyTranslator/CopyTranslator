import { Translator, Language } from "./types";
export { Translator, Language };
import { TranslatorType } from "@/common/types";
import { defaultTokens } from "./token";
import { axios } from "./proxy";
import config from "../configuration";
import { customTranslatorManager } from "./custom-translators";
import { detectLang } from "@opentranslate2/translator/dist/detect-lang";

export { detectLang };

export const translators = new Map<TranslatorType, Translator>();

const creators = new Map<TranslatorType, (config: any) => Translator>([
  ["baidu", (c) => { const { Baidu } = require("@opentranslate/baidu"); return new Baidu({ axios, config: c }); }],
  ["google", (c) => { const { GoogleWrapper } = require("./google-wrapper"); return new GoogleWrapper({ axios, config: c }); }],
  ["keyan", () => { const { keyan } = require("./keyan"); return keyan; }],
  ["youdao", (c) => { const { Youdao } = require("@opentranslate2/youdao"); return new Youdao({ axios, config: c }); }],
  ["sogou", (c) => { const { Sogou } = require("@opentranslate2/sogou"); return new Sogou({ axios, config: c }); }],
  ["caiyun", (c) => { const { Caiyun } = require("@opentranslate/caiyun"); return new Caiyun({ axios, config: c }); }],
  ["aliyun", (c) => { const { Aliyun } = require("@opentranslate2/aliyun"); return new Aliyun({ axios, config: c }); }],
  ["azure", (c) => { const { Azure } = require("@opentranslate2/azure"); return new Azure({ axios, config: c }); }],
  ["deepl", (c) => { const { Deepl } = require("@opentranslate2/deepl"); return new Deepl({ axios, config: c }); }],
  ["tencent", (c) => { const { Tencent } = require("@opentranslate2/tencent"); return new Tencent({ axios, config: c }); }],
  ["tencentsmart", (c) => { const { TencentSmart } = require("@opentranslate2/tencent-smart"); return new TencentSmart({ axios, config: c }); }],
  ["yandex", (c) => { const { Yandex } = require("@opentranslate2/yandex"); return new Yandex({ axios, config: c }); }],
  ["volc", (c) => { const { VolcTranslator } = require("@opentranslate2/volc"); return new VolcTranslator({ axios, config: c }); }],
  [
    "baidu-domain",
    (c) => {
      const { BaiduDomain } = require("@opentranslate2/baidu-domain");
      return new BaiduDomain({
        axios,
        config: {
          ...c,
          domain: "medicine",
        },
      }) as any;
    },
  ],
  ["stepfun", (c) => { const { Stepfun } = require("./stepfun"); return new Stepfun({ axios, config: c }); }],
  ["niu", (c) => { const { Niu } = require("@opentranslate2/niu"); return new Niu({ axios, config: c }); }],
]);

/**
 * 获取翻译器实例（支持内置翻译器和自定义翻译器）
 */
export function getTranslator(transType: TranslatorType | string): Translator {
  
  // 1. 检查缓存
  if (translators.has(transType as TranslatorType)) {
    return translators.get(transType as TranslatorType)!;
  }
  
  // 2. 检查内置翻译器
  if (creators.has(transType as TranslatorType)) {
    // 渲染进程优化：如果是渲染进程，且是内置翻译器，直接返回轻量级对象，避免加载重型依赖
    if (process.type === 'renderer') {
      return {
        name: transType,
        translate: () => Promise.reject(new Error("Translation engine should not be used in renderer process")),
        detect: () => Promise.resolve("auto"),
        getSupportLanguages: () => [],
      } as unknown as Translator;
    }

    const creator = creators.get(transType as TranslatorType)!;
    // 尝试获取配置，优先使用 store 中的配置
    let cfg = defaultTokens.get(transType as TranslatorType);
    try {
       if (config.has(transType as any)) {
           cfg = config.get(transType as any);
       }
    } catch(e) {
      // config 可能未初始化或在渲染进程中不可用（虽然不太可能，因为 config 做了代理）
    }
    
    const instance = creator(cfg);
    translators.set(transType as TranslatorType, instance);
    return instance;
  }
  
  // 3. 检查自定义翻译器
  const customTranslator = customTranslatorManager.getTranslator(transType);
  if (customTranslator) {
    return customTranslator;
  }
  
  // 4. 后备
  console.warn(`翻译器 "${transType}" 未找到，使用 Google 作为后备`);
  return getTranslator("google");
}

/**
 * 检查翻译器是否存在
 */
export function hasTranslator(transType: string): boolean {
  return creators.has(transType as TranslatorType) || 
         translators.has(transType as TranslatorType) ||
         customTranslatorManager.isCustomTranslator(transType);
}

/**
 * 获取所有可用的翻译器 ID（包括内置和自定义）
 */
export function getAllTranslatorIds(): string[] {
  const builtinIds = Array.from(creators.keys());
  const customIds = customTranslatorManager.getAllIds();
  return [...builtinIds, ...customIds];
}

export function getCustomTranslatorIds(
  customFromConfig: string[] = []
): string[] {
  const customIds = customTranslatorManager.getAllIds();
  return [...new Set([...customFromConfig, ...customIds])];
}

export function getAvailableTranslatorIds(
  builtInIds: string[] = [],
  customFromConfig: string[] = []
): string[] {
  return [...new Set([...builtInIds, ...getCustomTranslatorIds(customFromConfig)])];
}

export function getEnabledWithCustomIds(
  enabled: (TranslatorType | string)[] = [],
  customFromConfig: string[] = []
): (TranslatorType | string)[] {
  return [...new Set([...enabled, ...getCustomTranslatorIds(customFromConfig)])];
}

export function filterExistingEngines(
  engines: (TranslatorType | string)[] = []
): (TranslatorType | string)[] {
  return engines.filter((engine) => hasTranslator(String(engine)));
}

export function filterByActiveEngines(
  engines: (TranslatorType | string)[] = [],
  enabled: (TranslatorType | string)[] = [],
  customFromConfig: string[] = []
): (TranslatorType | string)[] {
  const activeSet = new Set(getEnabledWithCustomIds(enabled, customFromConfig));
  return engines.filter((engine) => activeSet.has(engine));
}

/**
 * 获取翻译器支持的语言列表
 */
export function getSupportLanguages(type: TranslatorType | string): Language[] {
  return getTranslator(type).getSupportLanguages();
}
