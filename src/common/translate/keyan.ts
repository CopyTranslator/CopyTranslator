import { axios } from "./proxy";
import {
  Language,
  TranslateQueryResult,
  TranslateError,
} from "@opentranslate/translator";
import { DirectionalTranslator } from "./types";
import md5 from "md5";

interface KeyanConfig {
  channel_id: string;
  channel_key: string;
}

export const defaultKeyanConfig: KeyanConfig = {
  channel_id: process.env.VUE_APP_KEYAN_CHANNEL_ID as string,
  channel_key: process.env.VUE_APP_KEYAN_CHANNEL_KEY as string,
};

const keyanLangMap: [Language, string][] = [
  ["zh-CN", "zh_hans"],
  ["en", "en"],
];
interface KeyanResult {
  data: string;
  err_code: number;
  err_msg?: string;
}

export class Keyan extends DirectionalTranslator<KeyanConfig> {
  readonly name = "keyan";
  private static readonly langMap = new Map(keyanLangMap);

  private static readonly langMapReverse = new Map(
    keyanLangMap.map(([translatorLang, lang]) => [lang, translatorLang])
  );

  isSupport(from: Language, to: Language): boolean {
    if (from == "en" && to == "zh-CN") {
      return true;
    } else {
      return false;
    }
  }

  getSupportSourceLanguages(): Language[] {
    return ["en"];
  }

  getSupportTargetLanguages(): Language[] {
    return ["zh-CN"];
  }

  protected async query(
    text: string,
    from: Language,
    to: Language,
    config: KeyanConfig
  ): Promise<TranslateQueryResult> {
    var timestamp = parseInt(
      (new Date().getTime() / 1000).toString()
    ).toString();
    var subject = "gen";
    var lang_from = Keyan.langMap.get("en");
    var lang_to = Keyan.langMap.get("zh-CN");
    var str1 = config.channel_id + config.channel_key + timestamp;
    const channel_id = config.channel_id;
    var sign = md5(str1);
    const result = await this.request<KeyanResult>(
      "https://www.keyanyuedu.com/api/trans",
      {
        method: "post",
        data: {
          text: text,
          from: lang_from,
          to: lang_to,
          subject: subject,
          channel_id: channel_id,
          sign: sign,
          timestamp: timestamp,
        },
      }
    ).then((res) => res.data);
    if (result.err_code != 0) {
      console.error(result);
      throw new TranslateError("NETWORK_ERROR");
    }
    const paragraphs = result.data.split("\n");
    return {
      text: text,
      from: from,
      to,
      origin: {
        paragraphs: [text],
        tts: (await this.textToSpeech(text, from)) as any,
      },
      trans: {
        paragraphs: paragraphs,
        tts: (await this.textToSpeech(paragraphs.join(" "), to)) as any,
      },
    };
  }
}

export const keyan = new Keyan({
  axios: axios,
  config: defaultKeyanConfig,
});
