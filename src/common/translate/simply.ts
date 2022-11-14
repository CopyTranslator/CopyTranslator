import {
  Language,
  Translator,
  TranslateQueryResult,
  TranslatorInit,
} from "@opentranslate/translator";
import qs from "qs";

const promiseAny = async <T>(
  iterable: Iterable<T | PromiseLike<T>>
): Promise<T> => {
  return Promise.all(
    [...iterable].map((promise) => {
      return new Promise((resolve, reject) =>
        Promise.resolve(promise).then(reject, resolve)
      );
    })
  ).then(
    (errors) => Promise.reject(errors),
    (value) => Promise.resolve<T>(value)
  );
};

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
  base: string;
  data: {
    source_language: Language;
    "translated-text": string;
  };
}

export interface SimplyConfig {
  /** Network request priority */
  URL: string;
}

export class Simply extends Translator<SimplyConfig> {
  constructor(init: TranslatorInit<SimplyConfig>) {
    super(init);
    this.updateFastestInstance();
  }
  /** Translator lang to custom lang */
  private static readonly langMap = new Map(langMap);

  /** Custom lang to translator lang */
  private static readonly langMapReverse = new Map(
    langMap.map(([translatorLang, lang]) => [lang, translatorLang])
  );

  async updateFastestInstance() {
    //自动寻找最快节点
    const text =
      "The main idea is transforming the passed promises list into a reverted promises list. When a reverted Promise resolves it calls reject, while when it rejects it calls resolve. Then the reverted promises list is passed to Promise.all method and when any of Promises rejects, Promise.all will terminate execution with reject error. However in reality this means that we have the successful result, so we just transform the result from reject to resolve back and that's all. We got first successfully resolved promise as a result without magic wand.";
    promiseAny(
      instances.map((url) => {
        return this.axios.get<SimplyDataResult["data"]>(
          `https://${url}/api/translate/?` +
            qs.stringify({
              engine: "google",
              from: "en",
              to: "zh-CN",
              text: text,
            })
        );
      })
    ).then((res) => {
      if (res.status != 200) {
        throw "update fastest simply instance fail";
      }
      const url = res.config.url as string;
      this.config.URL = url.split("/api/translate/")[0];
      console.log("fastest simply URL=", this.config.URL);
    });
  }

  private async fetch(
    text: string,
    from: string,
    to: string
  ): Promise<SimplyDataResult> {
    const { data } = await this.axios.get<SimplyDataResult["data"]>(
      `${this.config.URL}/api/translate/?` +
        qs.stringify({
          engine: "google",
          from: from,
          to: to,
          text: text,
        })
    );
    return { base: "https://translate.Simply.cn", data };
  }

  config: SimplyConfig = {
    URL: "https://simplytranslate.org",
  };

  protected async query(
    text: string,
    from: Language,
    to: Language,
    config: SimplyConfig
  ): Promise<TranslateQueryResult> {
    // console.log("use simply");
    let result = await this.fetch(text, from, to);

    if (!result) {
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

  readonly name = "Simply";

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
