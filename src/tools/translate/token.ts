import { TranslatorType } from "./types";

export const configs = new Map<TranslatorType, any>([
  [
    "baidu",
    {
      appid: process.env.VUE_APP_BAIDU_APP_ID as string,
      key: process.env.VUE_APP_BAIDU_APP_KEY as string
    }
  ],
  [
    "google",
    {
      token: process.env.VUE_APP_GOOGLE_TOKEN as string
    }
  ],
  [
    "youdao",
    {
      appKey: process.env.VUE_APP_YOUDAO_APP_KEY as string,
      key: process.env.VUE_APP_YOUDAO_APP_SECRET as string
    }
  ],
  [
    "caiyun",
    {
      token: process.env.VUE_APP_CAIYUN_TOKEN as string
    }
  ],
  [
    "tencent",
    {
      secretId: process.env.VUE_APP_TENCENT_APP_KEY as string,
      secretKey: process.env.VUE_APP_TENCENT_APP_SECRET as string
    }
  ],
  [
    "sogou",
    {
      pid: process.env.VUE_APP_SOGOU_PID as string,
      key: process.env.VUE_APP_SOGOU_KEY as string
    }
  ]
]);
