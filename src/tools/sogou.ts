const md5 = require("md5");
const fetch = require("node-fetch");
const sogou_option = {
  /**
   * Supported language: en, zh-CN, zh-TW, ja, kor, fr, de, es
   * `1` for supported
   */
  lang: "11111111",
  /**
   * If set to true, the dict start searching automatically.
   * Otherwise it'll only start seaching when user clicks the unfold button.
   * Default MUST be true and let user decide.
   */
  defaultUnfold: true,
  /**
   * This is the default height when the dict first renders the result.
   * If the content height is greater than the preferred height,
   * the preferred height is used and a mask with a view-more button is shown.
   * Otherwise the content height is used.
   */
  preferredHeight: 320,
  /** Word count to start searching */
  selectionWC: {
    min: 1,
    max: 999999999999999
  },
  /** Only start searching if the selection contains the language. */
  selectionLang: {
    eng: true,
    chs: true,
    japanese: true,
    korean: true,
    french: true,
    spanish: true,
    deutsch: true,
    others: true
  },
  /**
   * Optional dict custom options. Can only be boolean, number or string.
   * For string, add additional `options_sel` field to list out choices.
   */
  options: {
    /** Keep linebreaks on PDF */
    pdfNewline: false,
    tl: "default" as "default" | "zh-CHS" | "zh-CHT" | "en"
  },
  options_sel: {
    tl: ["default", "zh-CHS", "zh-CHT", "en"]
  }
};

export interface SogouSearchResult {
  /** search result */
  result: SogouResult;
  /** auto play sound */
  audio?: {
    uk?: string;
    us?: string;
    py?: string;
  };
}
export interface SogouStorage {
  // sogou search token
  token: string;
  // token added date, update the token every day
  tokenDate: number;
}

export interface SogouResult {
  /** Source language */
  sl: string;
  /** Target language */
  tl: string;

  searchText: string;

  trans: string;
}

export const enum SearchErrorType {
  NoResult,
  NetWorkError
}

export function handleNetWorkError(): Promise<never> {
  return Promise.reject(SearchErrorType.NetWorkError);
}

export function handleNoResult<T = any>(): Promise<T> {
  return Promise.reject(SearchErrorType.NoResult);
}

export const sogouCodes: ReadonlyArray<string> = [
  "zh-CHS",
  "zh-CHT",
  "en",
  "af",
  "ar",
  "bg",
  "bn",
  "bs-Latn",
  "ca",
  "cs",
  "cy",
  "da",
  "de",
  "el",
  "es",
  "et",
  "fa",
  "fi",
  "fil",
  "fj",
  "fr",
  "he",
  "hi",
  "hr",
  "ht",
  "hu",
  "id",
  "it",
  "ja",
  "ko",
  "lt",
  "lv",
  "mg",
  "ms",
  "mt",
  "mww",
  "nl",
  "no",
  "otq",
  "pl",
  "pt",
  "ro",
  "ru",
  "sk",
  "sl",
  "sm",
  "sr-Cyrl",
  "sr-Latn",
  "sv",
  "sw",
  "th",
  "tlh",
  "tlh-Qaak",
  "to",
  "tr",
  "ty",
  "uk",
  "ur",
  "vi",
  "yua",
  "yue"
];

export interface Payload {
  sl: string;
  tl: string;
}

export async function sogouTranslate(
  text: string,
  srcCode: string,
  tgtCode: string,
  dict_sogou: any = undefined
): Promise<SogouSearchResult> {
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
): SogouSearchResult | Promise<SogouSearchResult> {
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
    result: {
      sl,
      tl,
      trans: tr.dit,
      searchText: tr.text
    }
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

sogouTranslate("hello", "en", "zh-CHS")
  .then(res => {
    console.log(res);
  })
  .catch(e => console.log(e));
