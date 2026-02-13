import {
  TranslateResult,
  Language,
  Translator,
  Languages,
} from "@opentranslate/translator";
import { ColorStatus } from "../types";
import { TranslatorType } from "../types";

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

export { TranslateResult };
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
 * 自定义翻译器配置接口
 */
export interface CustomTranslatorConfig {
  id: string; // 唯一标识符，如 "openai-1", "openai-gpt4", "custom-deepseek" 等
  name?: string; // 显示名称
  type: "openai"; // 基础类型,目前仅支持 "openai"，未来可扩展为其他类型
  config: OpenAIConfig; // 翻译器配置
  enabled?: boolean; // 是否启用
}