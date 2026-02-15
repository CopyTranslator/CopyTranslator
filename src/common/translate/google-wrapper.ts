import { Translator, Language, TranslateResult } from "./types";
import { Google } from "@opentranslate/google";
import { Simply } from "./simply";
import { Lingva, defaultLingvaConfig } from "./lingva";
import { getProxyAxios } from "./proxy";

export interface GoogleWrapperConfig {
  apiKey: string;      // Google API token
  mirror: string | undefined;      // Google mirror URL
  source: "google" | "simply" | "lingva";  // 使用哪个后端
}

export class GoogleWrapper implements Translator {
  readonly name = "Google";
  config: GoogleWrapperConfig;
  private axios: any;
  private googleTranslator: Google | null = null;
  private simplyTranslator: Simply | null = null;
  private lingvaTranslator: Lingva | null = null;

  constructor({ axios, config }: { axios: any; config: GoogleWrapperConfig }) {
    this.axios = axios;
    this.config = config;
    this.initTranslators();
  }

  private initTranslators() {
    // 初始化各个翻译器实例（延迟初始化，按需使用）
  }

  private getGoogleTranslator(): Google {
    if (!this.googleTranslator) {
      let mirror = this.config.mirror;
      if (mirror != undefined) {
        if (mirror.endsWith("/")) {
          mirror = mirror.substring(0, mirror.length - 1);
        }
        if (mirror.length == 0) {
          mirror = undefined;
        }
      }
      this.googleTranslator = new Google({
        axios: getProxyAxios(true, mirror) as any,
      });
    }
    return this.googleTranslator;
  }

  private getSimplyTranslator(): Simply {
    if (!this.simplyTranslator) {
      this.simplyTranslator = new Simply({
        axios: this.axios,
        config: { URL: "https://simplytranslate.org" },
      });
    }
    return this.simplyTranslator;
  }

  private getLingvaTranslator(): Lingva {
    if (!this.lingvaTranslator) {
      this.lingvaTranslator = new Lingva({
        axios: this.axios,
        config: defaultLingvaConfig,
      });
    }
    return this.lingvaTranslator;
  }

  makeitGoogle(result: TranslateResult): TranslateResult {
    // 将结果包装成 Google 翻译的格式，方便后续处理
    return {
      ...result,
      engine: "google",
    };
  }

  get translator(): Translator {
    switch (this.config.source) {
      case "google":
        return this.getGoogleTranslator();
      case "simply":
        return this.getSimplyTranslator();
      case "lingva":
        return this.getLingvaTranslator();
      default:
        throw new Error(`Unknown Google source: ${this.config.source}`);
    }
  }

  async translate(
    text: string,
    from: Language,
    to: Language
  ): Promise<TranslateResult> {
    return this.translator.translate(text, from, to).then((res) => this.makeitGoogle(res));
  }

  async detect(text: string): Promise<Language> {
    return this.translator.detect(text);
  }

  getSupportLanguages(): Language[] {
    // 所有后端都支持相同的语言集（实际上可能略有不同，但为了简化返回通用集）
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
      "vi",
      "id",
      "th",
      "ms",
      "ar",
      "hi",
      "nl",
      "pl",
      "sv",
      "no",
      "da",
      "fi",
      "cs",
      "ro",
      "hu",
      "el",
      "uk",
      "bg",
      "hr",
      "sk",
      "sl",
      "et",
      "lv",
      "lt",
      "sr",
      "he",
      "fa",
      "bn",
      "ta",
      "te",
      "mr",
      "ur",
      "gu",
      "kn",
      "ml",
      "pa",
      "ne",
      "si",
      "km",
      "lo",
      "my",
      "ka",
      "hy",
      "az",
      "kk",
      "uz",
      "ky",
      "tg",
      "mn",
      "am",
      "sw",
      "af",
      "sq",
      "be",
      "bs",
      "ca",
      "cy",
      "eo",
      "eu",
      "fil",
      "ga",
      "gd",
      "gl",
      "ha",
      "haw",
      "hmn",
      "ht",
      "ig",
    ];
  }
}
