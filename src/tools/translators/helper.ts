import {
  TranslateResult,
  Translator,
  Language
} from "@opentranslate/translator";
import compact from "lodash.compact";
import sum from "lodash.sum";

export const chnEnds = /[？。！]/g;
export const engEnds = /[?.!]/g;
export const chnBreaks = /[？。！\n]/g;
export const engBreaks = /[?.!\n]/g;

const chineseStyles = ["zh-CN", "zh-TW", "ja", "ko"];

const tokenizer = require("sbd");
export function notEnglish(destCode: string) {
  return chineseStyles.includes(destCode);
}

const optional_options = {};

export function splitEng(text: string): string[] {
  return compact(tokenizer.sentences(text.trim(), optional_options));
}

export function splitChn(text: string): string[] {
  return compact(text.trim().split(chnEnds));
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
    let resultString = result.join(seprator);
    return resultString;
  }

  const counts = sentences.map(sentence => countSentences(sentence, splitFunc));
  if (sum(counts) != result.length) {
    return result.join("\n");
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
    let resultString = result.join(seprator);
    return resultString;
  }
  const counts = sentences.map(sentence => countSentences(sentence, splitFunc));

  if (sum(counts) != result.length) {
    return result.join("\n");
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

export function isValid(translator: Translator, lang: Language): boolean {
  return translator.getSupportLanguages().includes(lang);
}
