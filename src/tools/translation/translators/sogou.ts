import {
  CommonTranslateResult,
  handleNetWorkError,
  handleNoResult,
  Dict,
  Translator
} from "..";
const md5 = require("md5");
require("isomorphic-fetch");
const _ = require("lodash");

export const SogouLanguages: Dict = {
  "Chinese(Simplified)": "zh-CN",
  "Chinese(Traditional)": "zh-TW",
  English: "en",
  Afrikaans: "af",
  Arabic: "ar",
  Bulgarian: "bg",
  Bengali: "bn",
  Bosnian: "bs",
  Catalan: "ca",
  Czech: "cs",
  Welsh: "cy",
  Danish: "da",
  German: "de",
  Greek: "el",
  Spanish: "es",
  Estonian: "et",
  Persian: "fa",
  Finnish: "fi",
  Filipino: "fil",
  Fijian: "fj",
  French: "fr",
  Hebrew: "he",
  Hindi: "hi",
  Croatian: "hr",
  "Haitian creole": "ht",
  Hungarian: "hu",
  Indonesian: "id",
  Italian: "it",
  Japanese: "ja",
  Korean: "ko",
  Lithuanian: "lt",
  Latvian: "lv",
  Malagasy: "mg",
  Malay: "ms",
  Maltese: "mt",
  "Bai Miao Wen": "mww",
  Dutch: "nl",
  Norwegian: "no",
  "Cretaro Ottomi": "otq",
  Polish: "pl",
  Portuguese: "pt",
  Romanian: "ro",
  Russian: "ru",
  Slovak: "sk",
  Slovenian: "sl",
  Samoan: "sm",
  "Serbian(Cyrillic)": "sr-Cyrl",
  "Serbian(Latin)": "sr-Latn",
  Swedish: "sv",
  Swahili: "sw",
  Thai: "th",
  Klingon: "tlh",
  "Klingon(piqaD)": "tlh-Qaak",
  Tongan: "to",
  Turkish: "tr",
  Tahiti: "ty",
  Ukrainian: "uk",
  Urdu: "ur",
  Vietnamese: "vi",
  "Yucatan Mayan": "yua",
  "Cantonese(Traditional)": "yue"
};
const sogoucode: Dict = {
  "zh-CHS": "zh-CN",
  "zh-CHT": "zh-TW",
  en: "en",
  af: "af",
  ar: "ar",
  bg: "bg",
  bn: "bn",
  "bs-Latn": "bs",
  ca: "ca",
  cs: "cs",
  cy: "cy",
  da: "da",
  de: "de",
  el: "el",
  es: "es",
  et: "et",
  fa: "fa",
  fi: "fi",
  fil: "fil",
  fj: "fj",
  fr: "fr",
  he: "he",
  hi: "hi",
  hr: "hr",
  ht: "ht",
  hu: "hu",
  id: "id",
  it: "it",
  ja: "ja",
  ko: "ko",
  lt: "lt",
  lv: "lv",
  mg: "mg",
  ms: "ms",
  mt: "mt",
  mww: "mww",
  nl: "nl",
  no: "no",
  otq: "otq",
  pl: "pl",
  pt: "pt",
  ro: "ro",
  ru: "ru",
  sk: "sk",
  sl: "sl",
  sm: "sm",
  "sr-Cyrl": "sr-Cyrl",
  "sr-Latn": "sr-Latn",
  sv: "sv",
  sw: "sw",
  th: "th",
  tlh: "tlh",
  "tlh-Qaak": "tlh-Qaak",
  to: "to",
  tr: "tr",
  ty: "ty",
  uk: "uk",
  ur: "ur",
  vi: "vi",
  yua: "yua",
  yue: "yue"
};
const codesogou = _.invert(sogoucode);

const sogou2code = (sogou: string): string => sogoucode[sogou];
const code2sogou = (code: string): string => codesogou[code];
const SogouLangList = _.keys(SogouLanguages);
const SogouCodes = _.invert(SogouLanguages);

interface SogouStorage {
  // sogou search token
  token: string;
  // token added date, update the token every day
  tokenDate: number;
}
async function sogouTranslate(
  text: string,
  srcCode: string,
  tgtCode: string,
  dict_sogou: any = undefined
): Promise<CommonTranslateResult> {
  srcCode = code2sogou(srcCode);
  tgtCode = code2sogou(tgtCode);
  if (
    dict_sogou == undefined ||
    Date.now() - dict_sogou.tokenDate > 24 * 3600 * 1000
  ) {
    dict_sogou = {
      token:
        (await getSogouToken().catch(() => "")) ||
        "b33bf8c58706155663d1ad5dba4192dc",
      tokenDate: Date.now()
    };
  }
  return fetch("https://fanyi.sogou.com/reventondc/translate", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "X-Requested-With": "XMLHttpRequest"
    },
    body: `from=${srcCode}&to=${tgtCode}&text=${encodeURIComponent(
      text
    ).replace(/%20/g, "+")}&uuid=${getUUID()}&s=${md5(
      "" + srcCode + tgtCode + text + dict_sogou.token
    )}&client=pc&fr=browser_pc&useDetect=on&useDetectResult=on&needQc=1&oxford=on&isReturnSugg=on`
  })
    .then((r: any) => r.json())
    .catch(handleNetWorkError)
    .then((json: any) => handleJSON(json, srcCode, tgtCode))
    .catch(handleNetWorkError);
}

function handleJSON(
  json: any,
  sl: string,
  tl: string
): CommonTranslateResult | Promise<CommonTranslateResult> {
  const tr = json.translate as
    | undefined
    | {
        errorCode: string; // "0"
        from: string;
        to: string;
        text: string;
        dit: string;
      };
  if (!tr || tr.errorCode !== "0") {
    return handleNoResult();
  }
  return {
    text: tr.text,
    raw: undefined,
    link: "",
    from: sogou2code(sl),
    resultString: tr.dit,
    to: sogou2code(tl)
  };
}

function getUUID() {
  let uuid = "";
  for (let i = 0; i < 32; i++) {
    if (i === 8 || i === 12 || i === 16 || i === 20) {
      uuid += "-";
    }
    const digit = (16 * Math.random()) | 0;
    uuid += (i === 12 ? 4 : i === 16 ? (3 & digit) | 8 : digit).toString(16);
  }
  return uuid;
}

export async function getSogouToken(): Promise<string> {
  const homepage = await fetch("https://fanyi.sogou.com").then((r: any) =>
    r.text()
  );

  const appjsMatcher = /dlweb\.sogoucdn\.com\/translate\/pc\/static\/js\/app\.\S+\.js/;
  const appjsPath = (homepage.match(appjsMatcher) || [""])[0];
  if (!appjsPath) {
    return "";
  }
  const appjs = await fetch("https://" + appjsPath).then((r: any) => r.text());
  return (appjs.match(/"(\w{32})"/) || ["", ""])[1];
}

export class SogouTranslator extends Translator {
  sogouStorage: SogouStorage = {
    token: "b33bf8c58706155663d1ad5dba4192dc",
    tokenDate: Date.now()
  };

  constructor() {
    super();
    getSogouToken()
      .then(res => {
        this.sogouStorage.token = res;
      })
      .catch(() => "");
  }

  getLanguages() {
    return SogouLangList;
  }

  lang2code(lang: string) {
    return SogouLanguages[lang];
  }

  code2lang(code: string): string {
    return SogouCodes[code];
  }

  async translate(
    text: string,
    srcCode: string,
    destCode: string
  ): Promise<CommonTranslateResult | undefined> {
    try {
      let res: CommonTranslateResult = await sogouTranslate(
        text,
        srcCode,
        destCode
      );
      return res;
    } catch (e) {
      (<any>global).log.debug(e);
      return undefined;
    }
  }

  async detect(text: string): Promise<string | undefined> {
    return undefined;
  }
}
