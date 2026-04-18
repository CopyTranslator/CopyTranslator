import {
  BaseTranslator,
  Language,
  TranslateError,
  TranslateQueryResult,
} from "./types";

const languageMap = new Map<Language, string>([
  ["auto", "auto"],
  ["zh-CN", "ZH"],
  ["zh-TW", "ZH-HANT"],
  ["en", "EN"],
  ["ja", "JA"],
  ["ko", "KO"],
  ["fr", "FR"],
  ["es", "ES"],
  ["ru", "RU"],
  ["de", "DE"],
  ["it", "IT"],
  ["pt", "PT"],
]);

export function mapLanguageToDeepLX(lang: Language): string {
  return languageMap.get(lang) || String(lang).toUpperCase();
}

export class DeepLX extends BaseTranslator<{ url: string }> {
  name = "deeplx";
  config = { url: "" };

  constructor(options: { axios: any; config: any }) {
    super(options.axios);
    this.config.url = options.config?.url || "";
  }

  getSupportLanguages(): Language[] {
    return [
      "auto",
      "zh-CN",
      "zh-TW",
      "en",
      "ja",
      "ko",
      "fr",
      "es",
      "ru",
      "de",
      "it",
      "pt",
    ];
  }

  async detect(): Promise<Language> {
    return "auto";
  }

  protected async query(
    text: string,
    from: Language,
    to: Language,
    config: { url: string }
  ): Promise<TranslateQueryResult> {
    const url = (config.url || "").trim();
    if (!url) {
      throw new TranslateError("API_SERVER_ERROR");
    }

    const response = await this.axios.post(
      url,
      {
        text,
        source_lang: mapLanguageToDeepLX(from),
        target_lang: mapLanguageToDeepLX(to),
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
        timeout: 30000,
      }
    );

    const translatedText = response?.data?.data;
    if (
      typeof translatedText !== "string" ||
      translatedText.trim().length === 0
    ) {
      throw new TranslateError("API_SERVER_ERROR");
    }

    return {
      text,
      from,
      to,
      origin: {
        paragraphs: text.split(/\n+/),
        tts: "",
      },
      trans: {
        paragraphs: translatedText.split(/\n+/),
        tts: "",
      },
    };
  }
}

export default DeepLX;
