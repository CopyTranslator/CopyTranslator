import {
  Language,
  Translator,
  TranslateQueryResult,
} from "@opentranslate/translator";
import { promiseAny } from "./types";
import { axios } from "./proxy";

const langMap: [Language, string][] = [
  ["auto", "auto"],
  ["af", "af"],
  ["sq", "sq"],
  ["am", "am"],
  ["ar", "ar"],
  ["hy", "hy"],
  ["az", "az"],
  ["eu", "eu"],
  ["be", "be"],
  ["bn", "bn"],
  ["bs", "bs"],
  ["bg", "bg"],
  ["ca", "ca"],
  ["ceb", "ceb"],
  ["ny", "ny"],
  ["zh-CN", "zh"],
  ["zh-TW", "zh_HANT"],
  ["co", "co"],
  ["hr", "hr"],
  ["cs", "cs"],
  ["da", "da"],
  ["nl", "nl"],
  ["en", "en"],
  ["eo", "eo"],
  ["et", "et"],
  ["fi", "fi"],
  ["fr", "fr"],
  ["fy", "fy"],
  ["gl", "gl"],
  ["ka", "ka"],
  ["de", "de"],
  ["el", "el"],
  ["gu", "gu"],
  ["ht", "ht"],
  ["ha", "ha"],
  ["haw", "haw"],
  ["hi", "hi"],
  ["hmn", "hmn"],
  ["hu", "hu"],
  ["is", "is"],
  ["ig", "ig"],
  ["id", "id"],
  ["ga", "ga"],
  ["it", "it"],
  ["ja", "ja"],
  ["jw", "jw"],
  ["kn", "kn"],
  ["kk", "kk"],
  ["km", "km"],
  ["ko", "ko"],
  ["ku", "ku"],
  ["ky", "ky"],
  ["lo", "lo"],
  ["la", "la"],
  ["lv", "lv"],
  ["lt", "lt"],
  ["lb", "lb"],
  ["mk", "mk"],
  ["mg", "mg"],
  ["ms", "ms"],
  ["ml", "ml"],
  ["mt", "mt"],
  ["mi", "mi"],
  ["mr", "mr"],
  ["mn", "mn"],
  ["my", "my"],
  ["ne", "ne"],
  ["no", "no"],
  ["ps", "ps"],
  ["fa", "fa"],
  ["pl", "pl"],
  ["pt", "pt"],
  ["pa", "pa"],
  ["ro", "ro"],
  ["ru", "ru"],
  ["sm", "sm"],
  ["gd", "gd"],
  ["sr", "sr"],
  ["st", "st"],
  ["sn", "sn"],
  ["sd", "sd"],
  ["si", "si"],
  ["sk", "sk"],
  ["sl", "sl"],
  ["so", "so"],
  ["es", "es"],
  ["su", "su"],
  ["sw", "sw"],
  ["sv", "sv"],
  ["tg", "tg"],
  ["ta", "ta"],
  ["te", "te"],
  ["th", "th"],
  ["tr", "tr"],
  ["uk", "uk"],
  ["ur", "ur"],
  ["ug", "ug"],
  ["uz", "uz"],
  ["vi", "vi"],
  ["cy", "cy"],
  ["xh", "xh"],
  ["yi", "yi"],
  ["yo", "yo"],
  ["zu", "zu"],
  //   ["bm", "bm"],
  //   ["as", "as"],
  //   ["ay", "ay"],
  //   ["bho", "bho"],
  //   ["dv", "dv"],
  //   ["doi", "doi"],
  //   ["ee", "ee"],
  //   ["tl", "tl"],
  //   ["gn", "gn"],
  //   ["iw", "iw"],
  //   ["ilo", "ilo"],
  //   ["rw", "rw"],
  //   ["gom", "gom"],
  //   ["kri", "kri"],
  //   ["ckb", "ckb"],
  //   ["mai", "mai"],
  //   ["ln", "ln"],
  //   ["lg", "lg"],
  //   ["mni-Mtei", "mni-Mtei"],
  //   ["lus", "lus"],
  //   ["tt", "tt"],
  //   ["ti", "ti"],
  //   ["ts", "ts"],
  //   ["tk", "tk"],
  //   ["ak", "ak"],
  //   ["or", "or"],
  //   ["om", "om"],
  //   ["qu", "qu"],
  //   ["sa", "sa"],
  //   ["nso", "nso"],
];

const instances = [
  "lingva.ml",
  "translate.igna.wtf",
  "translate.plausibility.cloud",
  "translate.projectsegfau.lt",
  "translate.dr460nf1r3.org",
  "lingva.garudalinux.org",
  "translate.jae.fi",
];

const TIMEOUT = 1000 * 60 * 10; //10分钟检查一次

interface LingvaDataResult {
  translation: string;
}

export interface LingvaConfig {
  URL: string;
}

const defaultLingvaConfig: LingvaConfig = {
  URL: instances[0],
};

export class Lingva extends Translator<LingvaConfig> {
  readonly name = "Lingva";
  /** Translator lang to custom lang */
  private static readonly langMap = new Map(langMap);

  /** Custom lang to translator lang */
  private static readonly langMapReverse = new Map(
    langMap.map(([translatorLang, lang]) => [lang, translatorLang])
  );

  config: LingvaConfig = defaultLingvaConfig;

  lastCheck: number = 0;

  private async fetch(
    from: Language,
    to: Language,
    text: string,
    URL: string,
    log: boolean = true
  ) {
    let fromLang = Lingva.langMap.get(from);
    const predefined: Language[] = ["zh-TW", "zh-CN"];
    if (predefined.includes(from)) {
      fromLang = "zh";
    }
    const toLang = Lingva.langMap.get(to);
    const encodedText = encodeURIComponent(text);
    const queryURL = `https://${URL}/api/v1/${fromLang}/${toLang}/${encodedText}`;
    if (log) {
      //   console.log(queryURL);
    }

    return this.axios.get<LingvaDataResult>(queryURL);
  }

  private fetchWithMultipleURLs(
    from: Language,
    to: Language,
    text: string,
    URLs: string[]
  ) {
    return promiseAny(
      URLs.map((url) => {
        return this.fetch(from, to, text, url, false);
      })
    ).then((res) => {
      if (res.status != 200) {
        throw "update fastest lingva instance fail";
      }
      const url = res.config.url as string;
      this.config.URL = url.split("https://")[1].split("/api/v1")[0];
      console.log("fastest lingva URL=", this.config.URL);
      this.lastCheck = Date.now();
      return res;
    });
  }

  protected async query(
    text: string,
    from: Language,
    to: Language,
    config: LingvaConfig
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

    const transText = result.data["translation"];

    return {
      text: text,
      from: from || "auto",
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
    return [...Lingva.langMap.keys()];
  }

  async detect(text: string): Promise<Language> {
    try {
      return (await this.translate(text, "auto", "zh-CN")).from;
    } catch (e) {
      return "auto";
    }
  }
}

export const lingva = new Lingva({
  axios: axios,
  config: defaultLingvaConfig,
});
