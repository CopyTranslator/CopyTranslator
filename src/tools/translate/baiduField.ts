import {
  Language,
  Translator,
  TranslateError,
  TranslateQueryResult
} from "@opentranslate/translator";
import md5 from "md5";
import qs from "qs";
import { Domain } from "../types";

const langMap: [Language, string][] = [
  ["auto", "auto"],
  ["zh-CN", "zh"],
  ["en", "en"]
];

export interface BaiduFieldConfig {
  placeholder?: string;
  appid: string;
  key: string;
  domain: Domain;
}

export class BaiduField extends Translator<BaiduFieldConfig> {
  readonly name = "baidu";

  readonly endpoint =
    "https://fanyi-api.baidu.com/api/trans/vip/fieldtranslate";

  protected async query(
    text: string,
    from: Language,
    to: Language,
    config: BaiduFieldConfig
  ): Promise<TranslateQueryResult> {
    type BaiduFieldTranslateError = {
      error_code: "54001" | string;
      error_msg: "Invalid Sign" | string;
    };

    type BaiduFieldTranslateResult = {
      from: Language;
      to: Language;
      trans_result: Array<{
        dst: string;
        src: string;
      }>;
    };

    const salt = Date.now();
    const { endpoint } = this;
    const { appid, key, domain } = config;

    const res = await this.request<
      BaiduFieldTranslateResult | BaiduFieldTranslateError
    >(endpoint, {
      params: {
        from: BaiduField.langMap.get(from),
        to: BaiduField.langMap.get(to),
        q: text,
        salt,
        appid,
        domain,
        sign: md5(appid + text + salt + domain + key)
      }
    }).catch(() => {
      throw new TranslateError("NETWORK_ERROR");
    });

    const { data } = res;

    if ((data as BaiduFieldTranslateError).error_code) {
      console.error(
        new Error(
          "[BaiduField service]" + (data as BaiduFieldTranslateError).error_msg
        )
      );
      throw new TranslateError("API_SERVER_ERROR");
    }

    const {
      trans_result: transResult,
      from: langDetected
    } = data as BaiduFieldTranslateResult;

    return {
      text,
      from: langDetected,
      to,
      origin: {
        paragraphs: transResult.map(({ src }) => src),
        tts: await this.textToSpeech(text, langDetected)
      },
      trans: {
        paragraphs: transResult.map(({ dst }) => dst),
        tts: await this.textToSpeech(transResult[0].dst, to)
      }
    };
  }

  /** Translator lang to custom lang */
  private static readonly langMap = new Map(langMap);

  /** Custom lang to translator lang */
  private static readonly langMapReverse = new Map(
    langMap.map(([translatorLang, lang]) => [lang, translatorLang])
  );

  getSupportLanguages(): Language[] {
    return [...BaiduField.langMap.keys()];
  }

  async textToSpeech(text: string, lang: Language): Promise<string> {
    return `http://tts.baidu.com/text2audio?${qs.stringify({
      lan: BaiduField.langMap.get(lang !== "auto" ? lang : "zh-CN") || "zh",
      ie: "UTF-8",
      spd: 5,
      text
    })}`;
  }
}

export default BaiduField;
