import { OpenAI } from "./openai";

/**
 * 阶跃星辰翻译器
 * 继承自 OpenAI，使用阶跃星辰的 API 端点
 * 注意：apiBase、apiKey、model 由系统固定，用户不可修改
 */
export class Stepfun extends OpenAI {
  readonly name: string = "stepfun";

  constructor(options: { axios: any; config: any }) {
    super({
      axios: options.axios,
      config: {
        ...options.config,
        apiBase: "https://openrouter.ai/api/v1",
        model: "stepfun/step-3.5-flash:free",
        apiKey: process.env.VUE_APP_STEPFUN_API_KEY || "",
      },
    });
  }
}

export default Stepfun;
