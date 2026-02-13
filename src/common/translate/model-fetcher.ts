/**
 * 模型列表获取工具
 * 用于从 OpenAI 兼容的 API 获取可用模型列表
 */

import { axios } from "./proxy";

export interface ModelInfo {
  id: string;
  object?: string;
  created?: number;
  owned_by?: string;
}

export interface ModelsResponse {
  object: string;
  data: ModelInfo[];
}

/**
 * 从 OpenAI 兼容的 API 获取模型列表
 * @param apiBase API 基础地址（如：https://api.openai.com/v1）
 * @param apiKey API 密钥
 * @returns 模型 ID 列表
 */
export async function fetchModels(
  apiBase: string,
  apiKey: string
): Promise<string[]> {
  try {
    // 规范化 API Base URL
    let baseUrl = apiBase.trim();
    if (baseUrl.endsWith("/")) {
      baseUrl = baseUrl.slice(0, -1);
    }

    // 构建 models 端点 URL
    const modelsUrl = `${baseUrl}/models`;

    console.log(`[模型获取] 请求 URL: ${modelsUrl}`);

    // 发送请求
    const response = await axios.get(modelsUrl, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      timeout: 10000, // 10 秒超时
    });

    const responseData = response.data as ModelsResponse;
    if (responseData && responseData.data && Array.isArray(responseData.data)) {
      const models = responseData.data.map((model: ModelInfo) => model.id);
      console.log(`[模型获取] 成功获取 ${models.length} 个模型`);
      return models.sort(); // 按字母排序
    } else {
      throw new Error("API 返回格式不正确");
    }
  } catch (error) {
    console.error("[模型获取] 失败:", error);
    
    // 提供更友好的错误信息
    if (error.response) {
      // API 返回了错误响应
      const status = error.response.status;
      if (status === 401) {
        throw new Error("API Key 无效或已过期");
      } else if (status === 403) {
        throw new Error("没有访问权限");
      } else if (status === 404) {
        throw new Error("API 端点不存在，请检查 API Base 是否正确");
      } else {
        throw new Error(`API 错误 (${status}): ${error.response.statusText}`);
      }
    } else if (error.request) {
      // 请求已发送但没有收到响应
      throw new Error("无法连接到 API 服务器，请检查网络和 API Base");
    } else {
      // 其他错误
      throw new Error(error.message || "获取模型列表失败");
    }
  }
}

/**
 * 获取推荐的模型列表（作为后备）
 */
export function getRecommendedModels(provider: string): string[] {
  const modelMap: Record<string, string[]> = {
    openai: [
      "gpt-4-turbo-preview",
      "gpt-4",
      "gpt-4-32k",
      "gpt-3.5-turbo",
      "gpt-3.5-turbo-16k",
    ],
    azure: ["gpt-4", "gpt-35-turbo"],
    deepseek: ["deepseek-chat", "deepseek-coder"],
    moonshot: ["moonshot-v1-8k", "moonshot-v1-32k", "moonshot-v1-128k"],
    zhipu: ["glm-4", "glm-3-turbo"],
    dashscope: ["qwen-turbo", "qwen-plus", "qwen-max", "qwen-max-longcontext"],
  };

  return modelMap[provider] || [];
}

/**
 * 验证 API 配置
 */
export async function validateAPIConfig(
  apiBase: string,
  apiKey: string
): Promise<{ valid: boolean; error?: string; models?: string[] }> {
  try {
    const models = await fetchModels(apiBase, apiKey);
    return {
      valid: true,
      models,
    };
  } catch (error) {
    return {
      valid: false,
      error: error.message || "验证失败",
    };
  }
}
