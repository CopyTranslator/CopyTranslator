import { TranslatorType } from "@/common/types";
import { KeyConfig } from "@/common/rule";

export const defaultTokens = new Map<TranslatorType, any>([
  [
    "baidu",
    {
      appid: process.env.VUE_APP_BAIDU_APP_ID as string,
      key: process.env.VUE_APP_BAIDU_APP_KEY as string,
    },
  ],
  [
    "google",
    {
      token: process.env.VUE_APP_GOOGLE_TOKEN as string,
    },
  ],
  [
    "youdao",
    {
      appKey: process.env.VUE_APP_YOUDAO_APP_KEY as string,
      key: process.env.VUE_APP_YOUDAO_APP_SECRET as string,
    },
  ],
  [
    "caiyun",
    {
      token: process.env.VUE_APP_CAIYUN_TOKEN as string,
    },
  ],
  // [
  //   "tencent",
  //   {
  //     secretId: process.env.VUE_APP_TENCENT_APP_KEY as string,
  //     secretKey: process.env.VUE_APP_TENCENT_APP_SECRET as string,
  //   },
  // ],
  [
    "baidu-domain",
    {
      key: "",
      appid: "",
    },
  ],
  [
    "sogou",
    {
      pid: process.env.VUE_APP_SOGOU_PID as string,
      key: process.env.VUE_APP_SOGOU_KEY as string,
    },
  ],
  [
    "openai",
    {
      apiBase: process.env.VUE_APP_OPENAI_API_BASE || "https://api.openai.com/v1",
      apiKey: process.env.VUE_APP_OPENAI_API_KEY || "",
      model: process.env.VUE_APP_OPENAI_MODEL || "gpt-3.5-turbo",
      prompt: "default",
      temperature: "0.3",
      maxTokens: "4000",
    },
  ],
  [
    "stepfun",
    {
      apiBase: process.env.VUE_APP_STEPFUN_API_BASE || "https://openrouter.ai/api/v1",
      apiKey: process.env.VUE_APP_STEPFUN_API_KEY || "",
      model: process.env.VUE_APP_STEPFUN_MODEL || "stepfun/step-3.5-flash:free",
      prompt: "default",
      temperature: "0.3",
      maxTokens: "4000",
    },
  ],
  [
    "niu",{
      apikey:process.env.VUE_APP_NIU_API_KEY || "",
    }
  ]
]);

export function examToken(config: KeyConfig): boolean {
  for (const value of Object.values(config)) {
    if (value.length == 0) {
      return false;
    }
  }
  return true;
}
