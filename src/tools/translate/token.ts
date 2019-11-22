import { TranslatorType } from "./types";

export const configs = new Map<TranslatorType, Object>([
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
      appSecret: process.env.VUE_APP_YOUDAO_APP_SECRET as string
    }
  ]
]);
