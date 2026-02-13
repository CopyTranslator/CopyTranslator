import { Translator } from "@opentranslate/translator";
import { OpenAI } from "./openai";
import { axios } from "./proxy";
import config from "../configuration";
import { ProviderConfig, CustomTranslatorConfig } from "./types";

/**
 * 自定义翻译器管理器（基于供应商）
 * 
 * 新架构：
 * - 供应商配置：存储 API Base、API Key、已启用的模型列表
 * - 翻译器实例：从供应商配置展开生成，ID 格式为 `{providerId}-{modelName}`
 */
export class CustomTranslatorManager {
  private static instance: CustomTranslatorManager;
  
  // 翻译器实例缓存（运行时生成）
  private customTranslators: Map<string, Translator> = new Map();
  private customConfigs: Map<string, CustomTranslatorConfig> = new Map();
  
  // 供应商配置（持久化存储）
  private providers: Map<string, ProviderConfig> = new Map();

  private constructor() {
    // 延迟加载，等待配置系统初始化
  }

  /**
   * 获取单例实例
   */
  static getInstance(): CustomTranslatorManager {
    if (!CustomTranslatorManager.instance) {
      CustomTranslatorManager.instance = new CustomTranslatorManager();
    }
    return CustomTranslatorManager.instance;
  }

  /**
   * 确保已初始化（懒加载）
   */
  private initialize() {
    console.log("[供应商管理] 开始初始化...");
    this.loadFromConfig();
    this.expandProvidersToTranslators();
    config.set("customTranslators", this.getAllIds());
    console.log("[供应商管理] 初始化完成");
  }

  /**
   * 从配置系统加载供应商配置
   */
  private loadFromConfig() {
    try {
      if (!config || typeof config.get !== 'function') {
        console.warn("[供应商管理] 配置系统尚未初始化，跳过加载");
        return;
      }
      
      const providerConfigs = config.get("translatorProviders") as ProviderConfig[] || [];
      console.log(`[供应商管理] 从配置加载 ${providerConfigs.length} 个供应商`);
      
      for (const cfg of providerConfigs) {
        if (cfg.enabled !== false) {
          this.providers.set(cfg.id, cfg);
          console.log(`[供应商管理] 加载供应商: ${cfg.id} (${cfg.name}), 启用 ${cfg.enabledModels.length} 个模型`);
        }
      }
    } catch (error) {
      console.error("[供应商管理] 加载失败:", error);
    }
  }

  /**
   * 从供应商配置展开生成翻译器实例
   */
  private expandProvidersToTranslators() {
    this.customTranslators.clear();
    
    for (const provider of this.providers.values()) {
      if (provider.enabled === false) continue;
      
      for (const modelName of provider.enabledModels) {
        try {
          const translatorId = this.getTranslatorIdForModel(provider.id, modelName);
          const translatorConfig = this.getTranslatorConfig(provider, modelName);
          
          if (translatorConfig) {
            const translator = this.createTranslator(translatorConfig);
            this.customConfigs.set(translatorId, translatorConfig);
            this.customTranslators.set(translatorId, translator);

            console.log(`[供应商管理] 生成翻译器实例: ${translatorId}`);
          }
        } catch (error) {
          console.error(`[供应商管理] 创建翻译器失败 ${provider.id}-${modelName}:`, error);
        }
      }
    }
    
    console.log(`[供应商管理] 共生成 ${this.customTranslators.size} 个翻译器实例`);
  }


  private getTranslatorConfig(provider: ProviderConfig, modelName: string): CustomTranslatorConfig|null {
    try {
      // 目前只支持 OpenAI 兼容 API
      const config = provider.config || {};
      const translatorConfig = {
        apiBase: provider.apiBase,
        apiKey: provider.apiKey,
        model: modelName,
        temperature: config.temperature,
        maxTokens: config.maxTokens,
        prompt: config.prompt,
      };
      return {
        config: translatorConfig,
        id: this.getTranslatorIdForModel(provider.id, modelName),
        name: `${provider.name} - ${modelName}`,
        providerId: provider.id,
      };
    } catch (error) {
      console.error(`[供应商管理] 创建翻译器实例失败:`, error);
      return null;
    }
  }
  /**
   * 创建翻译器实例
   */
  private createTranslator(translatorConfig: CustomTranslatorConfig): Translator {
    return new OpenAI({ axios, config: translatorConfig.config });
  }

  /**
   * 保存供应商配置到配置系统
   */
  private saveToConfig() {
    try {
      const configs = Array.from(this.providers.values());
      config.set("translatorProviders", configs);
    } catch (error) {
      console.error("[供应商管理] 保存配置失败:", error);
    }
  }

  // ==================== 供应商管理方法 ====================

  /**
   * 添加供应商
   */
  addProvider(cfg: ProviderConfig): boolean {
    try {
      if (this.providers.has(cfg.id)) {
        console.warn(`[供应商管理] 供应商 ID "${cfg.id}" 已存在`);
        return false;
      }

      this.providers.set(cfg.id, cfg);
      this.expandProvidersToTranslators();
      this.saveToConfig();
      
      console.log(`[供应商管理] 添加供应商: ${cfg.id} (${cfg.name})`);
      return true;
    } catch (error) {
      console.error(`[供应商管理] 添加供应商失败:`, error);
      return false;
    }
  }

  /**
   * 更新供应商配置
   */
  updateProvider(id: string, updates: Partial<ProviderConfig>): boolean {
    try {
      const existing = this.providers.get(id);
      if (!existing) {
        console.warn(`[供应商管理] 供应商 ID "${id}" 不存在`);
        return false;
      }

      const updated: ProviderConfig = {
        ...existing,
        ...updates,
        config: {
          ...(existing.config || {}),
          ...(updates.config || {}),
        },
        enabledModels: updates.enabledModels || existing.enabledModels,
      };

      this.providers.set(id, updated);
      this.expandProvidersToTranslators();
      this.saveToConfig();
      
      console.log(`[供应商管理] 更新供应商: ${id}`);
      return true;
    } catch (error) {
      console.error(`[供应商管理] 更新供应商失败:`, error);
      return false;
    }
  }

  /**
   * 移除供应商
   */
  removeProvider(id: string): boolean {
    try {
      if (!this.providers.has(id)) {
        return false;
      }

      this.providers.delete(id);
      this.expandProvidersToTranslators();
      this.saveToConfig();
      
      console.log(`[供应商管理] 移除供应商: ${id}`);
      return true;
    } catch (error) {
      console.error(`[供应商管理] 移除供应商失败:`, error);
      return false;
    }
  }

  /**
   * 获取供应商配置
   */
  getProvider(id: string): ProviderConfig | undefined {
    return this.providers.get(id);
  }

  /**
   * 获取所有供应商配置
   */
  getAllProviders(): ProviderConfig[] {
    return Array.from(this.providers.values());
  }

  /**
   * 生成唯一的供应商 ID
   */
  generateUniqueProviderId(baseName: string): string {
    let id = baseName;
    let counter = 1;
    
    while (this.providers.has(id)) {
      id = `${baseName}-${counter}`;
      counter++;
    }
    
    return id;
  }

  // ==================== 模型管理方法 ====================

  /**
   * 启用模型
   */
  enableModel(providerId: string, modelName: string): boolean {
    const provider = this.providers.get(providerId);
    if (!provider) {
      console.warn(`[供应商管理] 供应商 "${providerId}" 不存在`);
      return false;
    }

    if (!provider.enabledModels.includes(modelName)) {
      provider.enabledModels.push(modelName);
      this.expandProvidersToTranslators();
      this.saveToConfig();
      console.log(`[供应商管理] 启用模型: ${providerId} - ${modelName}`);
      return true;
    }
    
    return false;
  }

  /**
   * 禁用模型
   */
  disableModel(providerId: string, modelName: string): boolean {
    const provider = this.providers.get(providerId);
    if (!provider) {
      console.warn(`[供应商管理] 供应商 "${providerId}" 不存在`);
      return false;
    }

    const index = provider.enabledModels.indexOf(modelName);
    if (index > -1) {
      provider.enabledModels.splice(index, 1);
      this.expandProvidersToTranslators();
      this.saveToConfig();
      console.log(`[供应商管理] 禁用模型: ${providerId} - ${modelName}`);
      return true;
    }
    
    return false;
  }

  /**
   * 切换模型启用状态
   */
  toggleModel(providerId: string, modelName: string): boolean {
    const provider = this.providers.get(providerId);
    if (!provider) return false;

    if (provider.enabledModels.includes(modelName)) {
      return this.disableModel(providerId, modelName);
    } else {
      return this.enableModel(providerId, modelName);
    }
  }

  /**
   * 获取供应商已启用的模型列表
   */
  getEnabledModels(providerId: string): string[] {
    const provider = this.providers.get(providerId);
    return provider ? [...provider.enabledModels] : [];
  }

  /**
   * 批量设置启用的模型
   */
  setEnabledModels(providerId: string, models: string[]): boolean {
    const provider = this.providers.get(providerId);
    if (!provider) {
      console.warn(`[供应商管理] 供应商 "${providerId}" 不存在`);
      return false;
    }

    provider.enabledModels = [...models];
    this.expandProvidersToTranslators();
    this.saveToConfig();
    console.log(`[供应商管理] 更新供应商 ${providerId} 的启用模型列表: ${models.join(', ')}`);
    return true;
  }

  // ==================== 翻译器实例访问 ====================

  /**
   * 获取翻译器 ID（格式: providerId-modelName）
   */
  getTranslatorIdForModel(providerId: string, modelName: string): string {
    return `${providerId}-${modelName}`;
  }

  /**
   * 获取翻译器实例
   */
  getTranslator(id: string): Translator | undefined {
    const translator = this.customTranslators.get(id);
    if (!translator) {
      console.warn(`[供应商管理] 未找到翻译器 "${id}"，可用的有: ${Array.from(this.customTranslators.keys()).join(', ')}`);
    }
    return translator;
  }

  /**
   * 获取所有翻译器 ID
   */
  getAllIds(): string[] {
    return Array.from(this.customTranslators.keys());
  }

  /**
   * 检查 ID 是否为自定义翻译器
   */
  isCustomTranslator(id: string): boolean {
    return this.customTranslators.has(id);
  }

  /**
   * 重新加载
   */
  reload() {
    this.customTranslators.clear();
    this.customConfigs.clear();
    this.providers.clear();
    this.initialize();
  }

  getConfig(id: string): CustomTranslatorConfig | undefined {
    return this.customConfigs.get(id);
  }
}

// 导出单例实例
export const customTranslatorManager = CustomTranslatorManager.getInstance();
