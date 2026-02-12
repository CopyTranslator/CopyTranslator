import { OpenAI, OpenAIConfig } from "./openai";

/**
 * 阶跃星辰翻译器
 * 继承自 OpenAI，使用阶跃星辰的 API 端点
 * 注意：apiBase、apiKey、model 由系统固定，用户不可修改
 */
export class Stepfun extends OpenAI {
  readonly name: string = "stepfun";

  constructor(options: { axios: any; config: any }) {
    // 强制使用固定的配置，apiBase、model、apiKey 都不允许用户配置
    const fixedConfig = {
      ...options.config,
      apiBase: "https://openrouter.ai/api/v1",
      model: "stepfun/step-3.5-flash:free",
      // apiKey 只从环境变量读取，不允许用户配置
      apiKey: process.env.VUE_APP_STEPFUN_API_KEY || "",
    };
    
    // 调用父类构造函数
    super({ axios: options.axios, config: fixedConfig });
  }
}

export default Stepfun;
