import { OpenAI, OpenAIConfig } from "./openai";

/**
 * 阶跃星辰翻译器
 * 继承自 OpenAI，使用阶跃星辰的 API 端点
 */
export class Stepfun extends OpenAI {
  readonly name: string = "stepfun";

  constructor(options: { axios: any; config: any }) {
    // 调用父类构造函数
    super(options);
    
    // 设置阶跃星辰的默认 API 基础地址
    if (!options.config || !options.config.apiBase) {
      this.config.apiBase = "https://api.stepfun.com/v1";
    }
    
    // 设置默认模型（如果未指定）
    if (!options.config || !options.config.model) {
      this.config.model = "step-3.5-flash";
    }
  }
}

export default Stepfun;
