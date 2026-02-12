import { Translator } from "@opentranslate/translator";
import { OpenAI, OpenAIConfig } from "./openai";
import { Stepfun } from "./stepfun";
import { axios } from "./proxy";
import config from "../configuration";
import eventBus from "../event-bus";

/**
 * 自定义翻译器配置接口
 */
export interface CustomTranslatorConfig {
  id: string; // 唯一标识符，如 "openai-1", "openai-gpt4", "custom-deepseek" 等
  name: string; // 显示名称
  type: "openai" | "stepfun"; // 基础类型
  config: OpenAIConfig; // 翻译器配置
  enabled?: boolean; // 是否启用
}

/**
 * 自定义翻译器管理器
 */
export class CustomTranslatorManager {
  private static instance: CustomTranslatorManager;
  private customTranslators: Map<string, Translator> = new Map();
  private customConfigs: Map<string, CustomTranslatorConfig> = new Map();
  private initialized: boolean = false;

  private constructor() {
    // 延迟加载，等待配置系统初始化
    // 注意：不在构造函数中调用 loadFromConfig
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
  private ensureInitialized() {
    if (!this.initialized) {
      console.log("[自定义翻译器] 开始初始化...");
      this.loadFromConfig();
      this.initialized = true;
    }
  }

  /**
   * 从配置系统加载自定义翻译器
   */
  private loadFromConfig() {
    try {
      // 检查配置系统是否可用
      if (!config || typeof config.get !== 'function') {
        console.warn("[自定义翻译器] 配置系统尚未初始化，跳过加载");
        return;
      }
      
      const customTranslatorConfigs = config.get("customTranslators") as CustomTranslatorConfig[] || [];
      console.log(`[自定义翻译器] 从配置加载 ${customTranslatorConfigs.length} 个翻译器`);
      
      for (const cfg of customTranslatorConfigs) {
        if (cfg.enabled !== false) { // 默认启用
          console.log(`[自定义翻译器] 加载翻译器: ${cfg.id} (${cfg.name})`);
          // 直接添加，不调用 addTranslator 避免重复初始化
          this.addTranslatorInternal(cfg);
        }
      }
    } catch (error) {
      console.error("[自定义翻译器] 加载失败:", error);
    }
  }

  /**
   * 内部添加方法（不触发 ensureInitialized）
   */
  private addTranslatorInternal(cfg: CustomTranslatorConfig): boolean {
    try {
      // 验证 ID 唯一性
      if (this.customTranslators.has(cfg.id)) {
        console.warn(`[自定义翻译器] ID "${cfg.id}" 已存在`);
        return false;
      }

      // 根据类型创建翻译器实例
      let translator: Translator;
      switch (cfg.type) {
        case "openai":
          translator = new OpenAI({ axios, config: cfg.config });
          break;
        case "stepfun":
          translator = new Stepfun({ axios, config: cfg.config });
          break;
        default:
          console.error(`[自定义翻译器] 未知的翻译器类型: ${cfg.type}`);
          return false;
      }

      this.customTranslators.set(cfg.id, translator);
      this.customConfigs.set(cfg.id, cfg);
      console.log(`[自定义翻译器] 成功添加: ${cfg.id}，当前共有 ${this.customTranslators.size} 个自定义翻译器`);
      
      return true;
    } catch (error) {
      console.error(`[自定义翻译器] 添加失败:`, error);
      return false;
    }
  }

  /**
   * 保存自定义翻译器到配置
   */
  private saveToConfig() {
    try {
      const configs = Array.from(this.customConfigs.values());
      config.set("customTranslators", configs);
    } catch (error) {
      console.error("保存自定义翻译器失败:", error);
    }
  }

  /**
   * 添加自定义翻译器
   */
  addTranslator(cfg: CustomTranslatorConfig): boolean {
    this.ensureInitialized();
    const result = this.addTranslatorInternal(cfg);
    if (result) {
      this.saveToConfig();
      // 通知界面更新
      eventBus.at("customTranslatorsChanged");
      console.log("[自定义翻译器] 发送更新事件");
    }
    return result;
  }

  /**
   * 更新自定义翻译器配置
   */
  updateTranslator(id: string, cfg: Partial<CustomTranslatorConfig>): boolean {
    this.ensureInitialized();
    try {
      const existingConfig = this.customConfigs.get(id);
      if (!existingConfig) {
        console.warn(`翻译器 ID "${id}" 不存在`);
        return false;
      }

      // 合并配置
      const newConfig: CustomTranslatorConfig = {
        ...existingConfig,
        ...cfg,
        config: {
          ...existingConfig.config,
          ...(cfg.config || {}),
        },
      };

      // 删除旧的翻译器
      this.removeTranslator(id, false);

      // 添加新的翻译器
      const result = this.addTranslator(newConfig);
      
      // 通知界面更新
      if (result) {
        eventBus.at("customTranslatorsChanged");
        console.log("[自定义翻译器] 发送更新事件");
      }
      
      return result;
    } catch (error) {
      console.error(`更新翻译器失败:`, error);
      return false;
    }
  }

  /**
   * 移除自定义翻译器
   */
  removeTranslator(id: string, saveToConfig: boolean = true): boolean {
    this.ensureInitialized();
    try {
      if (!this.customTranslators.has(id)) {
        return false;
      }

      this.customTranslators.delete(id);
      this.customConfigs.delete(id);
      
      if (saveToConfig) {
        this.saveToConfig();
      }
      
      // 通知界面更新
      eventBus.at("customTranslatorsChanged");
      console.log("[自定义翻译器] 发送更新事件");
      
      return true;
    } catch (error) {
      console.error(`移除翻译器失败:`, error);
      return false;
    }
  }

  /**
   * 获取自定义翻译器实例
   */
  getTranslator(id: string): Translator | undefined {
    this.ensureInitialized();
    const translator = this.customTranslators.get(id);
    if (!translator) {
      console.warn(`[自定义翻译器] 未找到 ID "${id}" 的翻译器，可用的有: ${Array.from(this.customTranslators.keys()).join(', ')}`);
    }
    return translator;
  }

  /**
   * 获取自定义翻译器配置
   */
  getConfig(id: string): CustomTranslatorConfig | undefined {
    this.ensureInitialized();
    return this.customConfigs.get(id);
  }

  /**
   * 获取所有自定义翻译器 ID
   */
  getAllIds(): string[] {
    this.ensureInitialized();
    return Array.from(this.customTranslators.keys());
  }

  /**
   * 获取所有自定义翻译器配置
   */
  getAllConfigs(): CustomTranslatorConfig[] {
    this.ensureInitialized();
    return Array.from(this.customConfigs.values());
  }

  /**
   * 检查 ID 是否为自定义翻译器
   */
  isCustomTranslator(id: string): boolean {
    this.ensureInitialized();
    return this.customTranslators.has(id);
  }

  /**
   * 重新加载所有自定义翻译器
   */
  reload() {
    this.customTranslators.clear();
    this.customConfigs.clear();
    this.initialized = false;
    this.ensureInitialized();
  }

  /**
   * 生成唯一的翻译器 ID
   */
  generateUniqueId(baseName: string): string {
    this.ensureInitialized();
    let id = baseName;
    let counter = 1;
    
    while (this.customTranslators.has(id)) {
      id = `${baseName}-${counter}`;
      counter++;
    }
    
    return id;
  }
}

// 导出单例实例
export const customTranslatorManager = CustomTranslatorManager.getInstance();
