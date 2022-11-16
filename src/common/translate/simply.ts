import {
  Language,
  Translator,
  TranslateQueryResult,
} from "@opentranslate/translator";
import qs from "qs";
import { promiseAny } from "./types";

const TIMEOUT = 1000 * 60 * 10; //10分钟检查一次

const langMap: [Language, string][] = [
  ["auto", "auto"],
  ["zh-CN", "zh-CN"],
  ["zh-TW", "zh-TW"],
  ["en", "en"],
  ["af", "af"],
  ["am", "am"],
  ["ar", "ar"],
  ["az", "az"],
  ["be", "be"],
  ["bg", "bg"],
  ["bn", "bn"],
  ["bs", "bs"],
  ["ca", "ca"],
  ["ceb", "ceb"],
  ["co", "co"],
  ["cs", "cs"],
  ["cy", "cy"],
  ["da", "da"],
  ["de", "de"],
  ["el", "el"],
  ["eo", "eo"],
  ["es", "es"],
  ["et", "et"],
  ["eu", "eu"],
  ["fa", "fa"],
  ["fi", "fi"],
  ["fr", "fr"],
  ["fy", "fy"],
  ["ga", "ga"],
  ["gd", "gd"],
  ["gl", "gl"],
  ["gu", "gu"],
  ["ha", "ha"],
  ["haw", "haw"],
  ["he", "he"],
  ["hi", "hi"],
  ["hmn", "hmn"],
  ["hr", "hr"],
  ["ht", "ht"],
  ["hu", "hu"],
  ["hy", "hy"],
  ["id", "id"],
  ["ig", "ig"],
  ["is", "is"],
  ["it", "it"],
  ["ja", "ja"],
  ["jw", "jw"],
  ["ka", "ka"],
  ["kk", "kk"],
  ["km", "km"],
  ["kn", "kn"],
  ["ko", "ko"],
  ["ku", "ku"],
  ["ky", "ky"],
  ["la", "la"],
  ["lb", "lb"],
  ["lo", "lo"],
  ["lt", "lt"],
  ["lv", "lv"],
  ["mg", "mg"],
  ["mi", "mi"],
  ["mk", "mk"],
  ["ml", "ml"],
  ["mn", "mn"],
  ["mr", "mr"],
  ["ms", "ms"],
  ["mt", "mt"],
  ["my", "my"],
  ["ne", "ne"],
  ["nl", "nl"],
  ["no", "no"],
  ["ny", "ny"],
  ["pa", "pa"],
  ["pl", "pl"],
  ["ps", "ps"],
  ["pt", "pt"],
  ["ro", "ro"],
  ["ru", "ru"],
  ["sd", "sd"],
  ["si", "si"],
  ["sk", "sk"],
  ["sl", "sl"],
  ["sm", "sm"],
  ["sn", "sn"],
  ["so", "so"],
  ["sq", "sq"],
  ["sr", "sr"],
  ["st", "st"],
  ["su", "su"],
  ["sv", "sv"],
  ["sw", "sw"],
  ["ta", "ta"],
  ["te", "te"],
  ["tg", "tg"],
  ["th", "th"],
  ["fil", "tl"],
  ["tr", "tr"],
  ["ug", "ug"],
  ["uk", "uk"],
  ["ur", "ur"],
  ["uz", "uz"],
  ["vi", "vi"],
  ["xh", "xh"],
  ["yi", "yi"],
  ["yo", "yo"],
  ["zu", "zu"],
];

const instances = [
  "simplytranslate.org",
  "st.tokhmi.xyz",
  "translate.josias.dev",
  "translate.namazso.eu",
  "translate.riverside.rocks",
  "simplytranslate.manerakai.com",
  "translate.bus-hit.me",
  "simplytranslate.pussthecat.org",
  "translate.northboot.xyz",
  "translate.tiekoetter.com",
  "simplytranslate.esmailelbob.xyz",
  "tl.vern.cc",
  "translate.slipfox.xyz",
  "st.privacydev.net",
  "translate.beparanoid.de",
  "translate.priv.pw",
  "st.odyssey346.dev",
];

interface SimplyDataResult {
  source_language: Language;
  "translated-text": string;
}

export interface SimplyConfig {
  URL: string;
}

export class Simply extends Translator<SimplyConfig> {
  readonly name = "Simply";
  /** Translator lang to custom lang */
  private static readonly langMap = new Map(langMap);

  /** Custom lang to translator lang */
  private static readonly langMapReverse = new Map(
    langMap.map(([translatorLang, lang]) => [lang, translatorLang])
  );

  config: SimplyConfig = {
    URL: instances[0],
  };

  lastCheck: number = 0;

  private async fetch(from: string, to: string, text: string, URL: string) {
    return this.axios.get<SimplyDataResult>(
      `https://${URL}/api/translate/?` +
        qs.stringify({
          engine: "google",
          from: from,
          to: to,
          text: text,
        })
    );
  }

  private fetchWithMultipleURLs(
    from: Language,
    to: Language,
    text: string,
    URLs: string[]
  ) {
    return promiseAny(
      URLs.map((url) => {
        return this.fetch(from, to, text, url);
      })
    ).then((res) => {
      if (res.status != 200) {
        throw "update fastest simply instance fail";
      }
      const url = res.config.url as string;
      this.config.URL = url.split("https://")[1].split("/api/translate/")[0];
      console.log("fastest simply URL=", this.config.URL);
      this.lastCheck = Date.now();
      return res;
    });
  }

  protected async query(
    text: string,
    from: Language,
    to: Language,
    config: SimplyConfig
  ): Promise<TranslateQueryResult> {
    let result;
    if (Date.now() - this.lastCheck > TIMEOUT) {
      result = await this.fetchWithMultipleURLs(from, to, text, instances);
    } else {
      result = await this.fetch(from, to, text, config.URL);
    }

    if (!result.data) {
      console.error(result);
      throw new Error("NETWORK_ERROR");
    }

    const transText = result.data["translated-text"];

    return {
      text: text,
      from: Simply.langMapReverse.get(result.data["source_language"]) || "auto",
      to,
      origin: {
        paragraphs: text.split(/\n+/),
        tts: (await this.textToSpeech(text, from)) || "",
      },
      trans: {
        paragraphs: transText.split(/(\n ?)+/),
        tts: (await this.textToSpeech(transText, to)) || "",
      },
    };
  }

  getSupportLanguages(): Language[] {
    return [...Simply.langMap.keys()];
  }

  async detect(text: string): Promise<Language> {
    try {
      return (await this.translate(text, "auto", "zh-CN")).from;
    } catch (e) {
      return "auto";
    }
  }
}

export default Simply;
