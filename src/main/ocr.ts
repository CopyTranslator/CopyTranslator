const AipOcrClient = require("baidu-aip-sdk").ocr;
import { examToken } from "@/common/translate/token";
import eventBus from "@/common/event-bus";
import conf from "@/common/configuration";
import { Language } from "@opentranslate/languages";
import logger from "@/common/logger";
const ShortcutCapture = require("shortcut-capture");
export const shortcutCapture = new ShortcutCapture();

type LanguageType =
  | "CHN_ENG"
  | "ENG"
  | "POR"
  | "FRE"
  | "GER"
  | "ITA"
  | "SPA"
  | "RUS"
  | "JAP"
  | "KOR";

export class Recognizer {
  client: any;

  constructor() {
    shortcutCapture.on("capture", (data: any) =>
      this.recognize(data["dataURL"])
    );
  }

  enabled(): boolean {
    return !!this.client;
  }

  setUp(config: { app_id: string; api_key: string; secret_key: string }) {
    if (!examToken(config)) {
      //修复config无效时依然client不为undefined
      this.client = undefined;
    } else {
      const { app_id, api_key, secret_key } = config;
      this.client = new AipOcrClient(app_id, api_key, secret_key);
    }
  }

  capture() {
    shortcutCapture.shortcutCapture();
  }

  getLanguage(): LanguageType {
    const srcLang: Language = conf.get("sourceLanguage");
    switch (srcLang) {
      case "en":
        return "CHN_ENG";
      case "zh-CN":
        return "CHN_ENG";
      case "pt":
        return "POR";
      case "fr":
        return "FRE";
      case "de":
        return "GER";
      case "it":
        return "ITA";
      case "es":
        return "SPA";
      case "ru":
        return "RUS";
      case "ja":
        return "JAP";
      case "ko":
        return "KOR";
      default:
        return "CHN_ENG";
    }
  }

  recognize(image: string) {
    if (!this.client) {
      return;
    }
    image = image.substring(image.indexOf(",") + 1);

    this.client
      .generalBasic(image, {
        language_type: this.getLanguage(),
        detect_language: "true",
      })
      .then(function (result: { words_result: Array<{ words: string }> }) {
        const text = result.words_result
          .map((item) => item["words"])
          .join("\n");
        logger.toast("OCR完成，正在翻译");
        eventBus.at("dispatch", "translate", text);
      })
      .catch(function (err: any) {
        // 如果发生网络错误Z
        console.log(err);
        logger.toast("OCR失败");
      });
  }
}
export const recognizer = new Recognizer();
