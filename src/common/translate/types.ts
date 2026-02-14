import {
  TranslateResult,
  Language,
  Translator,
  Languages,
  TranslateQueryResult,
  TranslateError,
} from "@opentranslate2/translator";
import { ColorStatus } from "../types";
import { TranslatorType } from "../types";
export { TranslateResult, Language, Translator, Languages, TranslateQueryResult, TranslateError };

export interface SharedResult {
  text: string;
  translation: string;
  from: string;
  to: string;
  engine: string;
  transPara: string[];
  textPara: string[];
  chineseStyle: boolean;
  status?: ColorStatus;
}

export function emptySharedResult(overrides = {}): SharedResult {
  return {
    text: "",
    translation: "",
    from: "",
    to: "",
    engine: "",
    transPara: [],
    textPara: [],
    status: "None",
    chineseStyle: false,
    ...overrides,
  };
}

export interface DiffPart {
  value: string;
  added: boolean;
  removed: boolean;
}
export interface DiffParts {
  parts: Array<Array<DiffPart>>;
  engine: TranslatorType;
}

export type CopyTranslateResult = TranslateResult & {
  resultString: string;
};

export type ResultBuffer = {
  [key: string]: SharedResult;
};


export interface CopyTranslator {
  translate(
    text: string,
    from: Language,
    to: Language
  ): Promise<TranslateResult>;
  detect(text: string): Promise<Language>;
  getSupportLanguages(): Language[];
}

export abstract class DirectionalTranslator<
  Config extends {}
> extends Translator<Config> {
  getSupportLanguages(): Languages {
    throw "This method should not be used for DirectionalTranslator.";
  }
  abstract getSupportSourceLanguages(): Language[];
  abstract getSupportTargetLanguages(): Language[];
  abstract isSupport(from: Language, to: Language): boolean;
}

export const promiseAny = async <T>(
  iterable: Iterable<T | PromiseLike<T>>
): Promise<T> => {
  return Promise.all(
    [...iterable].map((promise) => {
      return new Promise((resolve, reject) =>
        Promise.resolve(promise).then(reject, resolve)
      );
    })
  ).then(
    (errors) => Promise.reject(errors),
    (value) => Promise.resolve<T>(value)
  );
};

// OpenAI 兼容 API 的配置接口
export interface OpenAIConfig {
  apiBase: string; // API 基础地址，例如: https://api.openai.com/v1
  apiKey: string; // API 密钥
  model?: string; // 模型名称，默认为 gpt-3.5-turbo
  prompt?: string; // 自定义提示词模板，使用 {from}, {to}, {text} 作为占位符
  temperature?: number; // 温度参数，默认为 0.3
  maxTokens?: number; // 最大生成token数，默认为 2000
}

/**
 * 供应商配置接口
 * 一个供应商可以提供多个翻译模型
 */
export interface ProviderConfig {
  id: string; // 供应商唯一标识符，如 "openai-official", "deepseek-main"
  name: string; // 显示名称，如 "OpenAI Official", "DeepSeek API"
  providerType: string; // 供应商类型：openai/deepseek/moonshot/zhipu/dashscope/custom
  apiBase: string; // API 基础地址
  apiKey: string; // API 密钥
  enabledModels: string[]; // 已启用的模型列表，如 ["gpt-4", "gpt-3.5-turbo"]
  config?: {
    // 可选的默认配置，会应用到所有模型
    temperature?: number;
    maxTokens?: number;
    prompt?: string;
  };
  enabled?: boolean; // 是否启用该供应商（默认true）
}

/**
 * 预定义供应商模板
 * 用于快速配置常见的 API 供应商
 */
export interface ProviderTemplate {
  type: string; // 供应商类型标识，如 "openai", "deepseek"
  name: string; // 默认显示名称
  apiBase: string; // 默认 API Base URL
  recommendedModels: string[]; // 推荐模型列表（作为获取失败时的后备）
  icon?: string; // 图标名称（mdi-icon）
  image?: string; // 图片文件名（用于 EngineButton 显示）
  docUrl?: string; // 文档链接
  description?: string; // 供应商描述
}

// 目前只支持 OpenAI 兼容 API 的自定义翻译器配置
export type CustomTranslatorConfig = {
  id: string;
  name: string;
  providerId: string; // 关联到供应商 ID
  config: OpenAIConfig;
};
