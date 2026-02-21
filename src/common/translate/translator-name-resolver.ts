import { customTranslatorManager } from "./custom-translators";
import { builtInTranslatorMetadata, isBuiltInTranslator } from "./metadata";
import config from "../configuration";

/**
 * 翻译器名称解析器
 * 统一处理所有翻译器（内置 + 自定义）的显示名称获取
 */
export class TranslatorNameResolver {
  /**
   * 获取翻译器的显示名称
   * 优先级：本地化翻译 > tooltip > 自定义配置名称 > 内置元数据名称 > 原始ID
   */
  static getDisplayName(translatorId: string, locale: Record<string, any> = {}): string {
    // 1. 优先使用本地化翻译
    const localized = locale[translatorId];
    if (localized) {
      return localized;
    }

    // 2. 尝试查找 tooltip 作为后备名称
    const tooltipKey = `<tooltip>${translatorId}`;
    if (locale[tooltipKey]) {
      return locale[tooltipKey];
    }

    // 3. 检查是否为自定义翻译器
    if (customTranslatorManager.isCustomTranslator(translatorId)) {
      const customConfig = customTranslatorManager.getConfig(translatorId);
      if (customConfig && customConfig.name) {
        return customConfig.name;
      }
    }

    // 4. 检查内置翻译器元数据
    if (isBuiltInTranslator(translatorId)) {
      return builtInTranslatorMetadata[translatorId].name;
    }

    // 5. 最后返回原始ID
    return translatorId;
  }

  /**
   * 批量获取翻译器显示名称
   */
  static getDisplayNames(
    translatorIds: string[],
    locale: Record<string, any> = {}
  ): Map<string, string> {
    const result = new Map<string, string>();
    for (const id of translatorIds) {
      result.set(id, this.getDisplayName(id, locale));
    }
    return result;
  }

  /**
   * 获取所有可用翻译器（内置 + 自定义）
   */
  static getAllTranslatorIds(): string[] {
    const builtInIds = Object.keys(builtInTranslatorMetadata);
    const customIds = customTranslatorManager.getAllIds();
    return [...new Set([...builtInIds, ...customIds])];
  }

  /**
   * 获取所有内置翻译器
   */
  static getBuiltInTranslatorIds(): string[] {
    return Object.keys(builtInTranslatorMetadata);
  }

  /**
   * 获取所有自定义翻译器
   */
  static getCustomTranslatorIds(): string[] {
    return customTranslatorManager.getAllIds();
  }

  /**
   * 检查是否为自定义翻译器
   */
  static isCustomTranslator(translatorId: string): boolean {
    return customTranslatorManager.isCustomTranslator(translatorId);
  }

  /**
   * 检查是否为内置翻译器
   */
  static isBuiltInTranslator(translatorId: string): boolean {
    return isBuiltInTranslator(translatorId);
  }

  /**
   * 获取自定义翻译器配置
   */
  static getCustomConfig(translatorId: string) {
    return customTranslatorManager.getConfig(translatorId);
  }

  /**
   * 获取自定义翻译器的 provider
   */
  static getCustomProvider(translatorId: string) {
    const config = this.getCustomConfig(translatorId);
    if (config) {
      return customTranslatorManager.getProvider(config.providerId);
    }
    return null;
  }

  static getEngineClass(translatorId: string): string {
    if (customTranslatorManager.isCustomTranslator(translatorId)) {
      const customConfig = customTranslatorManager.getConfig(translatorId);
      if (customConfig) {
        const provider = customTranslatorManager.getProvider(
          customConfig.providerId
        );
        if (provider) {
          const providerType = provider.providerType || "custom";
          return `provider-${providerType}`;
        }
      }
      return "custom-translator";
    }
    if (translatorId == "baidu-domain") {
      return `${translatorId}-${config.get<any>("baidu-domain").domain}`;
    }
    return translatorId;
  }
}
