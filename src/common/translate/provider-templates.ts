import { ProviderTemplate } from "./types";

/**
 * 预定义的供应商模板
 * 提供常见 AI 服务商的默认配置
 */
export const providerTemplates: ProviderTemplate[] = [
  {
    type: "stepfun",
    name: "阶跃星辰(StepFun)",
    apiBase: "https://api.stepfun.com/v1",
    recommendedModels: [
      "step-3.5-flash",
    ],
    icon: "mdi-robot",
    image: "stepfun.svg",
    docUrl: "https://platform.stepfun.com/docs/zh/overview/concept",
    description: "阶跃星辰开放平台 - 注意：系统已内置免费版本，此处添加需自备API密钥",
  },
  {
    type: "openai",
    name: "OpenAI",
    apiBase: "https://api.openai.com/v1",
    recommendedModels: [
      "gpt-4o",
      "gpt-4o-mini",
      "gpt-4-turbo",
      "gpt-4",
      "gpt-3.5-turbo",
    ],
    icon: "mdi-robot",
    image: "openai.svg",
    docUrl: "https://platform.openai.com/docs/api-reference",
    description: "OpenAI 官方 API 服务",
  },
  {
    type: "azure",
    name: "Azure OpenAI",
    apiBase: "https://{your-resource-name}.openai.azure.com/openai/deployments/{deployment-id}",
    recommendedModels: ["gpt-4", "gpt-35-turbo"],
    icon: "mdi-microsoft-azure",
    image: "azure.svg",
    docUrl: "https://learn.microsoft.com/azure/ai-services/openai/",
    description: "Microsoft Azure OpenAI 服务",
  },
  {
    type: "deepseek",
    name: "DeepSeek(深度求索)",
    apiBase: "https://api.deepseek.com/v1",
    recommendedModels: ["deepseek-chat", "deepseek-coder"],
    icon: "mdi-brain",
    image: "deepseek.svg",
    docUrl: "https://platform.deepseek.com/api-docs",
    description: "DeepSeek AI 服务",
  },
  {
    type: "moonshot",
    name: "Moonshot AI (月之暗面)",
    apiBase: "https://api.moonshot.cn/v1",
    recommendedModels: [
      "moonshot-v1-8k",
      "moonshot-v1-32k",
      "moonshot-v1-128k",
    ],
    icon: "mdi-moon-waxing-crescent",
    image: "moonshot.svg",
    docUrl: "https://platform.moonshot.cn/docs",
    description: "Moonshot AI (Kimi) 服务",
  },
  {
    type: "zhipu",
    name: "智谱 AI (GLM)",
    apiBase: "https://open.bigmodel.cn/api/paas/v4",
    recommendedModels: [
      "glm-4",
      "glm-4-plus",
      "glm-4-air",
      "glm-3-turbo",
    ],
    icon: "mdi-lightbulb-on",
    image: "zhipu.svg",
    docUrl: "https://open.bigmodel.cn/dev/api",
    description: "智谱 AI (清言) 服务",
  },
  {
    type: "dashscope",
    name: "阿里云百炼 (DashScope)",
    apiBase: "https://dashscope.aliyuncs.com/compatible-mode/v1",
    recommendedModels: [
      "qwen-plus",
      "qwen-turbo",
      "qwen-max",
      "qwen-max-longcontext",
    ],
    icon: "mdi-cloud",
    image: "bailian.svg",
    docUrl: "https://help.aliyun.com/zh/dashscope/",
    description: "阿里云通义千问服务",
  },
  {
    type: "ollama",
    name: "Ollama (本地)",
    apiBase: "http://localhost:11434/v1",
    recommendedModels: [
      "llama3.2",
      "qwen2.5",
      "gemma2",
      "mistral",
    ],
    icon: "mdi-server",
    image: "ollama.svg",
    docUrl: "https://ollama.com/",
    description: "本地 Ollama 服务",
  },
  {
    type: "custom",
    name: "自定义",
    apiBase: "https://",
    recommendedModels: [],
    icon: "mdi-cog",
    image: "robot.svg",
    description: "自定义 OpenAI 兼容 API",
  },
];

/**
 * 根据类型获取供应商模板
 */
export function getProviderTemplate(
  type: string
): ProviderTemplate | undefined {
  return providerTemplates.find((t) => t.type === type);
}

/**
 * 获取所有供应商类型
 */
export function getAllProviderTypes(): string[] {
  return providerTemplates.map((t) => t.type);
}

/**
 * 获取供应商的推荐模型列表
 */
export function getRecommendedModels(providerType: string): string[] {
  const template = getProviderTemplate(providerType);
  return template ? template.recommendedModels : [];
}
