import { TranslateResult } from "copy-translation.js/declaration/api/types";
export const chnEnds = /[？。！]/g;
export const engEnds = /[?.!]/g;
export const chnBreaks = /[？。！\n]/g;
export const engBreaks = /[?.!\n]/g;
const chineseStyles = ["zh-CN", "zh-TW", "ja", "ko"];
const _ = require("lodash");
const tokenizer = require("sbd");
export function notEnglish(destCode: string) {
  return _.includes(chineseStyles, destCode);
}
/** 统一的查询结果的数据结构 */

export interface CommonTranslateResult extends TranslateResult {
  resultString?: string;
}
export type Dict = { [key: string]: string };
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
const optional_options = {};

export function splitEng(text: string): string[] {
  return _.compact(tokenizer.sentences(text.trim(), optional_options));
}

export function splitChn(text: string): string[] {
  return _.compact(text.trim().split(chnEnds));
}

function countSentences(str: string, splitFunc: (text: string) => string[]) {
  let t = splitFunc(str);

  return t.length;
}

export function reSegmentGoogle(
  text: string,
  result: string[],
  srcCode: string,
  destCode: string
) {
  const sentences = text.split("\n");

  const seprator = notEnglish(destCode) ? "" : " ";
  const ends: RegExp = notEnglish(srcCode) ? chnEnds : engEnds;
  const splitFunc = notEnglish(srcCode) ? splitChn : splitEng;
  if (sentences.length == 1) {
    let resultString = _.join(result, seprator);
    return resultString;
  }

  const counts = sentences.map(sentence => countSentences(sentence, splitFunc));
  if (_.sum(counts) != result.length) {
    return _.join(result, "\n");
  }

  let resultString = "";
  let index = 0;
  counts.forEach(count => {
    for (let i = 0; i < count; i++) {
      resultString += seprator + result[index];
      index++;
    }
    resultString += "\n";
  });
  return resultString;
}

export function reSegment(
  text: string,
  result: string[],
  srcCode: string,
  destCode: string
) {
  const sentences = text.split("\n");
  const seprator = notEnglish(destCode) ? "" : " ";
  const ends: RegExp = notEnglish(srcCode) ? chnEnds : engEnds;
  const splitFunc = notEnglish(srcCode) ? splitChn : splitEng;
  if (sentences.length == 1) {
    let resultString = _.join(result, seprator);
    return resultString;
  }
  const counts = sentences.map(sentence => countSentences(sentence, splitFunc));

  if (_.sum(counts) != result.length) {
    return _.join(result, "\n");
  }

  let resultString = "";
  let index = 0;
  counts.forEach(count => {
    for (let i = 0; i < count; i++) {
      resultString += seprator + result[index];
      index++;
    }
    resultString += "\n";
  });
  return resultString;
}

/*
在短时间内请求多次，会被谷歌直接封掉IP，所以上一次commit试图通过多次异步请求后组合并没有什么卵用
 */
export abstract class Translator {
  abstract getLanguages(): [string];

  abstract lang2code(lang: string): string;

  abstract code2lang(code: string): string;

  abstract translate(
    text: string,
    srcCode: string,
    destCode: string
  ): Promise<CommonTranslateResult | undefined>;

  abstract detect(text: string): Promise<string | undefined>; //return lang
}
export const langcodes = {
  af: {
    en: "Afrikaans",
    zh_CN: "南非荷兰语",
    zh_TW: "南非荷蘭語"
  },
  am: {
    en: "Amharic",
    zh_CN: "阿姆哈拉语",
    zh_TW: "阿姆哈拉語"
  },
  ar: {
    en: "Arabic",
    zh_CN: "阿拉伯语",
    zh_TW: "阿拉伯語"
  },
  ara: {
    en: "Arabic",
    zh_CN: "阿拉伯语",
    zh_TW: "阿拉伯語"
  },
  az: {
    en: "Azeerbaijani",
    zh_CN: "阿塞拜疆语",
    zh_TW: "亞塞拜然語"
  },
  be: {
    en: "Belarusian",
    zh_CN: "白俄罗斯语",
    zh_TW: "白俄羅斯語"
  },
  bg: {
    en: "Bulgarian",
    zh_CN: "保加利亚语",
    zh_TW: "保加利亞語"
  },
  bn: {
    en: "Bengali",
    zh_CN: "孟加拉语",
    zh_TW: "孟加拉語"
  },
  bs: {
    en: "Bosnian",
    zh_CN: "波斯尼亚语",
    zh_TW: "波斯尼亞語"
  },
  "bs-Latn": {
    en: "Bosnian",
    zh_CN: "波斯尼亚语",
    zh_TW: "波斯尼亞語"
  },
  bul: {
    en: "Bulgarian",
    zh_CN: "保加利亚语",
    zh_TW: "保加利亞語"
  },
  ca: {
    en: "Catalan",
    zh_CN: "加泰罗尼亚语",
    zh_TW: "加泰羅尼亞語"
  },
  ceb: {
    en: "Cebuano",
    zh_CN: "宿务语",
    zh_TW: "宿務語"
  },
  cht: {
    en: "Chinese (Traditional)",
    zh_CN: "中文（繁体）",
    zh_TW: "中文（繁體）"
  },
  co: {
    en: "Corsican",
    zh_CN: "科西嘉语",
    zh_TW: "科西嘉語"
  },
  cs: {
    en: "Czech",
    zh_CN: "捷克语",
    zh_TW: "捷克語"
  },
  cy: {
    en: "Welsh",
    zh_CN: "威尔士语",
    zh_TW: "威爾士語"
  },
  da: {
    en: "Danish",
    zh_CN: "丹麦语",
    zh_TW: "丹麥語"
  },
  dan: {
    en: "Danish",
    zh_CN: "丹麦语",
    zh_TW: "丹麥語"
  },
  de: {
    en: "German",
    zh_CN: "德语",
    zh_TW: "德語"
  },
  el: {
    en: "Greek",
    zh_CN: "希腊语",
    zh_TW: "希臘語"
  },
  en: {
    en: "English",
    zh_CN: "英语",
    zh_TW: "英語"
  },
  eo: {
    en: "Esperanto",
    zh_CN: "世界语",
    zh_TW: "世界語"
  },
  es: {
    en: "Spanish",
    zh_CN: "西班牙语",
    zh_TW: "西班牙語"
  },
  est: {
    en: "Estonian",
    zh_CN: "爱沙尼亚语",
    zh_TW: "愛沙尼亞語"
  },
  et: {
    en: "Estonian",
    zh_CN: "爱沙尼亚语",
    zh_TW: "愛沙尼亞語"
  },
  eu: {
    en: "Basque",
    zh_CN: "巴斯克语",
    zh_TW: "巴斯克語"
  },
  fa: {
    en: "Persian",
    zh_CN: "波斯语",
    zh_TW: "波斯語"
  },
  fi: {
    en: "Finnish",
    zh_CN: "芬兰语",
    zh_TW: "芬蘭語"
  },
  fil: {
    en: "Filipino",
    zh_CN: "菲律宾语",
    zh_TW: "菲律賓語"
  },
  fin: {
    en: "Finnish",
    zh_CN: "芬兰语",
    zh_TW: "芬蘭語"
  },
  fj: {
    en: "Fijian",
    zh_CN: "斐济语",
    zh_TW: "斐濟語"
  },
  fr: {
    en: "French",
    zh_CN: "法语",
    zh_TW: "法語"
  },
  fra: {
    en: "French",
    zh_CN: "法语",
    zh_TW: "法語"
  },
  fy: {
    en: "Frisian",
    zh_CN: "弗里斯兰语",
    zh_TW: "弗里斯蘭語"
  },
  ga: {
    en: "Irish",
    zh_CN: "爱尔兰语",
    zh_TW: "愛爾蘭語"
  },
  gd: {
    en: "Scots Gaelic",
    zh_CN: "苏格兰盖尔语",
    zh_TW: "蘇格蘭蓋爾語"
  },
  gl: {
    en: "Galician",
    zh_CN: "加利西亚语",
    zh_TW: "加利西亞語"
  },
  gu: {
    en: "Gujarati",
    zh_CN: "古吉拉特语",
    zh_TW: "古吉拉特語"
  },
  ha: {
    en: "Hausa",
    zh_CN: "豪萨语",
    zh_TW: "豪薩語"
  },
  haw: {
    en: "Hawaiian",
    zh_CN: "夏威夷语",
    zh_TW: "夏威夷語"
  },
  he: {
    en: "Hebrew",
    zh_CN: "希伯来语",
    zh_TW: "希伯來語"
  },
  hi: {
    en: "Hindi",
    zh_CN: "印地语",
    zh_TW: "印地語"
  },
  hmn: {
    en: "Hmong",
    zh_CN: "苗语",
    zh_TW: "苗語"
  },
  hr: {
    en: "Croatian",
    zh_CN: "克罗地亚语",
    zh_TW: "克羅埃西亞語"
  },
  ht: {
    en: "Haitian Creole",
    zh_CN: "海地克里奥尔语",
    zh_TW: "海地克里奧爾語"
  },
  hu: {
    en: "Hungarian",
    zh_CN: "匈牙利语",
    zh_TW: "匈牙利語"
  },
  hy: {
    en: "Armenian",
    zh_CN: "亚美尼亚语",
    zh_TW: "亞美尼亞語"
  },
  id: {
    en: "Indonesian",
    zh_CN: "印度尼西亚语",
    zh_TW: "印度尼西亞語"
  },
  ig: {
    en: "Igbo",
    zh_CN: "伊博语",
    zh_TW: "伊博語"
  },
  is: {
    en: "Icelandic",
    zh_CN: "冰岛语",
    zh_TW: "冰島語"
  },
  it: {
    en: "Italian",
    zh_CN: "意大利语",
    zh_TW: "義大利語"
  },
  iw: {
    en: "Hebrew",
    zh_CN: "希伯来语",
    zh_TW: "希伯來語"
  },
  ja: {
    en: "Japanese",
    zh_CN: "日语",
    zh_TW: "日語"
  },
  jp: {
    en: "Japanese",
    zh_CN: "日语",
    zh_TW: "日語"
  },
  jw: {
    en: "Javanese",
    zh_CN: "爪哇语",
    zh_TW: "爪哇語"
  },
  ka: {
    en: "Georgian",
    zh_CN: "格鲁吉亚语",
    zh_TW: "喬治亞語"
  },
  kk: {
    en: "Kazakh",
    zh_CN: "哈萨克语",
    zh_TW: "哈薩克語"
  },
  km: {
    en: "Khmer",
    zh_CN: "高棉语",
    zh_TW: "高棉語"
  },
  kn: {
    en: "Kannada",
    zh_CN: "卡纳达语",
    zh_TW: "卡納達語"
  },
  ko: {
    en: "Korean",
    zh_CN: "韩语",
    zh_TW: "韓語"
  },
  kor: {
    en: "Korean",
    zh_CN: "韩语",
    zh_TW: "韓語"
  },
  ku: {
    en: "Kurdish",
    zh_CN: "库尔德语",
    zh_TW: "庫爾德語"
  },
  ky: {
    en: "Kyrgyz",
    zh_CN: "吉尔吉斯语",
    zh_TW: "吉爾吉斯語"
  },
  la: {
    en: "Latin",
    zh_CN: "拉丁语",
    zh_TW: "拉丁語"
  },
  lb: {
    en: "Luxembourgish",
    zh_CN: "卢森堡语",
    zh_TW: "盧森堡語"
  },
  lo: {
    en: "Lao",
    zh_CN: "老挝语",
    zh_TW: "寮國語"
  },
  lt: {
    en: "Lithuanian",
    zh_CN: "立陶宛语",
    zh_TW: "立陶宛語"
  },
  lv: {
    en: "Latvian",
    zh_CN: "拉脱维亚语",
    zh_TW: "拉脫維亞語"
  },
  mg: {
    en: "Malagasy",
    zh_CN: "马尔加什语",
    zh_TW: "馬爾加什語"
  },
  mi: {
    en: "Maori",
    zh_CN: "毛利语",
    zh_TW: "毛利語"
  },
  mk: {
    en: "Macedonian",
    zh_CN: "马其顿语",
    zh_TW: "馬其頓語"
  },
  ml: {
    en: "Malayalam",
    zh_CN: "马拉雅拉姆语",
    zh_TW: "馬拉雅拉姆語"
  },
  mn: {
    en: "Mongolian",
    zh_CN: "蒙古语",
    zh_TW: "蒙古語"
  },
  mr: {
    en: "Marathi",
    zh_CN: "马拉地语",
    zh_TW: "馬拉地語"
  },
  ms: {
    en: "Malay",
    zh_CN: "马来语",
    zh_TW: "馬來語"
  },
  mt: {
    en: "Maltese",
    zh_CN: "马耳他语",
    zh_TW: "馬耳他語"
  },
  mww: {
    en: "Bai Miao Wen",
    zh_CN: "白苗文",
    zh_TW: "白苗文"
  },
  my: {
    en: "Myanmar (Burmese)",
    zh_CN: "缅甸语",
    zh_TW: "緬甸語"
  },
  ne: {
    en: "Nepali",
    zh_CN: "尼泊尔语",
    zh_TW: "尼泊爾語"
  },
  nl: {
    en: "Dutch",
    zh_CN: "荷兰语",
    zh_TW: "荷蘭語"
  },
  no: {
    en: "Norwegian",
    zh_CN: "挪威语",
    zh_TW: "挪威語"
  },
  ny: {
    en: "Nyanja (Chichewa)",
    zh_CN: "尼杨扎语（齐切瓦语）",
    zh_TW: "尼楊扎語（齊切瓦語）"
  },
  otq: {
    en: "Cretaro Ottomi",
    zh_CN: "克雷塔罗奥托米语",
    zh_TW: "克雷塔羅奧托米語"
  },
  pa: {
    en: "Punjabi",
    zh_CN: "旁遮普语",
    zh_TW: "旁遮普語"
  },
  pl: {
    en: "Polish",
    zh_CN: "波兰语",
    zh_TW: "波蘭語"
  },
  ps: {
    en: "Pashto",
    zh_CN: "普什图语",
    zh_TW: "普什圖語"
  },
  pt: {
    en: "Portuguese (Portugal, Brazil)",
    zh_CN: "葡萄牙语（葡萄牙、巴西）",
    zh_TW: "葡萄牙語（葡萄牙、巴西）"
  },
  pt_BR: {
    en: "Brazilian",
    zh_CN: "巴西语",
    zh_TW: "巴西語"
  },
  ro: {
    en: "Romanian",
    zh_CN: "罗马尼亚语",
    zh_TW: "羅馬尼亞語"
  },
  rom: {
    en: "Romanian",
    zh_CN: "罗马尼亚语",
    zh_TW: "羅馬尼亞語"
  },
  ru: {
    en: "Russian",
    zh_CN: "俄语",
    zh_TW: "俄語"
  },
  sd: {
    en: "Sindhi",
    zh_CN: "信德语",
    zh_TW: "信德語"
  },
  si: {
    en: "Sinhala (Sinhalese)",
    zh_CN: "僧伽罗语",
    zh_TW: "僧伽羅語"
  },
  sk: {
    en: "Slovak",
    zh_CN: "斯洛伐克语",
    zh_TW: "斯洛伐克語"
  },
  sl: {
    en: "Slovenian",
    zh_CN: "斯洛文尼亚语",
    zh_TW: "斯洛維尼亞語"
  },
  slo: {
    en: "Slovenian",
    zh_CN: "斯洛文尼亚语",
    zh_TW: "斯洛維尼亞語"
  },
  sm: {
    en: "Samoan",
    zh_CN: "萨摩亚语",
    zh_TW: "薩摩亞語"
  },
  sn: {
    en: "Shona",
    zh_CN: "修纳语",
    zh_TW: "修納語"
  },
  so: {
    en: "Somali",
    zh_CN: "索马里语",
    zh_TW: "索馬利亞語"
  },
  spa: {
    en: "Spanish",
    zh_CN: "西班牙语",
    zh_TW: "西班牙語"
  },
  sq: {
    en: "Albanian",
    zh_CN: "阿尔巴尼亚语",
    zh_TW: "阿爾巴尼亞語"
  },
  sr: {
    en: "Serbian",
    zh_CN: "塞尔维亚语",
    zh_TW: "塞爾維亞語"
  },
  "sr-Cyrl": {
    en: "Serbian (Cyrillic)",
    zh_CN: "塞尔维亚语(西里尔文)",
    zh_TW: "塞爾維亞語(西里爾文)"
  },
  "sr-Latn": {
    en: "Serbian (Latin)",
    zh_CN: "塞尔维亚语(拉丁文)",
    zh_TW: "塞爾維亞語(拉丁文)"
  },
  st: {
    en: "Sesotho",
    zh_CN: "塞索托语",
    zh_TW: "塞索托語"
  },
  su: {
    en: "Sundanese",
    zh_CN: "巽他语",
    zh_TW: "巽他語"
  },
  sv: {
    en: "Swedish",
    zh_CN: "瑞典语",
    zh_TW: "瑞典語"
  },
  sw: {
    en: "Swahili",
    zh_CN: "斯瓦希里语",
    zh_TW: "斯瓦希里語"
  },
  swe: {
    en: "Swedish",
    zh_CN: "瑞典语",
    zh_TW: "瑞典語"
  },
  ta: {
    en: "Tamil",
    zh_CN: "泰米尔语",
    zh_TW: "泰米爾語"
  },
  te: {
    en: "Telugu",
    zh_CN: "泰卢固语",
    zh_TW: "泰盧固語"
  },
  tg: {
    en: "Tajik",
    zh_CN: "塔吉克语",
    zh_TW: "塔吉克語"
  },
  th: {
    en: "Thai",
    zh_CN: "泰语",
    zh_TW: "泰語"
  },
  tl: {
    en: "Tagalog (Filipino)",
    zh_CN: "塔加路语（菲律宾语）",
    zh_TW: "塔加路語（菲律賓語）"
  },
  tlh: {
    en: "Klingon",
    zh_CN: "克林贡语",
    zh_TW: "克林貢語"
  },
  "tlh-Qaak": {
    en: "Klingon (piqaD)",
    zh_CN: "克林贡语(piqaD)",
    zh_TW: "克林貢語(piqaD)"
  },
  to: {
    en: "Tongan",
    zh_CN: "汤加语",
    zh_TW: "湯加語"
  },
  tr: {
    en: "Turkish",
    zh_CN: "土耳其语",
    zh_TW: "土耳其語"
  },
  ty: {
    en: "Tahiti",
    zh_CN: "塔希提语",
    zh_TW: "塔希提語"
  },
  uk: {
    en: "Ukrainian",
    zh_CN: "乌克兰语",
    zh_TW: "烏克蘭語"
  },
  ur: {
    en: "Urdu",
    zh_CN: "乌尔都语",
    zh_TW: "烏爾都語"
  },
  uz: {
    en: "Uzbek",
    zh_CN: "乌兹别克语",
    zh_TW: "烏茲別克語"
  },
  vi: {
    en: "Vietnamese",
    zh_CN: "越南语",
    zh_TW: "越南語"
  },
  vie: {
    en: "Vietnamese",
    zh_CN: "越南语",
    zh_TW: "越南語"
  },
  wyw: {
    en: "Classical Chinese",
    zh_CN: "文言文",
    zh_TW: "文言文"
  },
  xh: {
    en: "Xhosa",
    zh_CN: "班图语",
    zh_TW: "班圖語"
  },
  yi: {
    en: "Yiddish",
    zh_CN: "意第绪语",
    zh_TW: "意第緒語"
  },
  yo: {
    en: "Yoruba",
    zh_CN: "约鲁巴语",
    zh_TW: "約魯巴語"
  },
  yua: {
    en: "Yucatan Mayan",
    zh_CN: "尤卡坦玛雅语",
    zh_TW: "尤卡坦瑪雅語"
  },
  yue: {
    en: "Cantonese (Traditional)",
    zh_CN: "粤语（繁体）",
    zh_TW: "粵語（繁體）"
  },
  zh: {
    en: "Chinese (Simplified)",
    zh_CN: "中文（简体）",
    zh_TW: "中文（簡體）"
  },
  "zh-CHS": {
    en: "Chinese (Simplified)",
    zh_CN: "中文（简体）",
    zh_TW: "中文（簡體）"
  },
  "zh-CHT": {
    en: "Chinese (Traditional)",
    zh_CN: "中文（繁体）",
    zh_TW: "中文（繁體）"
  },
  "zh-CN": {
    en: "Chinese (Simplified)",
    zh_CN: "中文（简体）",
    zh_TW: "中文（簡體）"
  },
  "zh-TW": {
    en: "Chinese (Traditional)",
    zh_CN: "中文（繁体）",
    zh_TW: "中文（繁體）"
  },
  zu: {
    en: "Zulu",
    zh_CN: "祖鲁语",
    zh_TW: "祖魯語"
  }
};

let allLanguages = {
  Afrikaans: "af",
  Albanian: "sq",
  Amharic: "am",
  Arabic: "ar",
  Armenian: "hy",
  Azerbaijani: "az",
  "Bas-que": "eu",
  Belarusian: "be",
  Bengali: "bn",
  Bosnian: "bs",
  Bulgarian: "bg",
  Catalan: "ca",
  Cebuano: "ceb",
  Chichewa: "ny",
  "Chinese(Simplified)": "zh-CN",
  "Chinese(Traditional)": "zh-TW",
  Corsican: "co",
  Croatian: "hr",
  Czech: "cs",
  Danish: "da",
  Dutch: "nl",
  English: "en",
  Esperanto: "eo",
  Estonian: "et",
  Filipino: "fil",
  Finnish: "fi",
  French: "fr",
  Frisian: "fy",
  Galician: "gl",
  Georgian: "ka",
  German: "de",
  Greek: "el",
  Gujarati: "gu",
  "Haitian creole": "ht",
  Hausa: "ha",
  Hawaiian: "haw",
  Hebrew: "he",
  Hindi: "hi",
  Hmong: "hmn",
  Hungarian: "hu",
  Icelandic: "is",
  Igbo: "ig",
  Indonesian: "id",
  Irish: "ga",
  Italian: "it",
  Japanese: "ja",
  Javanese: "jw",
  Kannada: "kn",
  Kazakh: "kk",
  Khmer: "km",
  Korean: "ko",
  "Kurdish(kurmanji)": "ku",
  Kyrgyz: "ky",
  Lao: "lo",
  Latin: "la",
  Latvian: "lv",
  Lithuanian: "lt",
  Luxembourgish: "lb",
  Macedonian: "mk",
  Malagasy: "mg",
  Malay: "ms",
  Malayalam: "ml",
  Maltese: "mt",
  Maori: "mi",
  Marathi: "mr",
  Mongolian: "mn",
  "Myanmar(burmese)": "my",
  Nepali: "ne",
  Norwegian: "no",
  Pashto: "ps",
  Persian: "fa",
  Polish: "pl",
  Portuguese: "pt",
  Punjabi: "pa",
  Romanian: "ro",
  Russian: "ru",
  Samoan: "sm",
  "Scots gaelic": "gd",
  Serbian: "sr",
  Sesotho: "st",
  Shona: "sn",
  Sindhi: "sd",
  Sinhala: "si",
  Slovak: "sk",
  Slovenian: "sl",
  Somali: "so",
  Spanish: "es",
  Sundanese: "su",
  Swahili: "sw",
  Swedish: "sv",
  Tajik: "tg",
  Tamil: "ta",
  Telugu: "te",
  Thai: "th",
  Turkish: "tr",
  Ukrainian: "uk",
  Urdu: "ur",
  Uzbek: "uz",
  Vietnamese: "vi",
  Welsh: "cy",
  Xhosa: "xh",
  Yiddish: "yi",
  Yoruba: "yo",
  Zulu: "zu",
  fj: "Fijian",
  mww: "Bai Miao Wen",
  otq: "Cretaro Ottomi",
  "sr-Cyrl": "Serbian(Cyrillic)",
  "sr-Latn": "Serbian(Latin)",
  tlh: "Klingon",
  "tlh-Qaak": "Klingon(piqaD)",
  to: "Tongan",
  ty: "Tahiti",
  yua: "Yucatan Mayan",
  yue: "Cantonese(Traditional)"
};
