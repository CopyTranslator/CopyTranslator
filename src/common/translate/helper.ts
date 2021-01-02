import {
  Translator,
  Language,
  TranslateResult,
} from "@opentranslate/translator";
import compact from "lodash.compact";
import sum from "lodash.sum";
import trim from "lodash.trim";
import trimstart from "lodash.trimstart";
import { CopyTranslateResult } from "./types";

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

// split with seprator
export function splitChn(text: string): string[] {
  let sentences = compact(text.trim().split(chnEnds));
  let ends = [];
  for (let c of text) {
    if ("？。！".includes(c)) {
      ends.push(c);
    }
  }
  if (ends.length == sentences.length || ends.length == sentences.length - 1) {
    for (let i = 0; i < ends.length; i++) {
      sentences[i] += ends[i];
    }
  }
  return sentences;
}

function countSentences(str: string, splitFunc: (text: string) => string[]) {
  const t = splitFunc(str);

  return t.length;
}

export function reSegmentGoogle(
  text: string,
  result: string[],
  srcCode: string,
  destCode: string
): { resultString: string; paragraphs: string[] } {
  const sentences = text.split("\n");

  const seprator = notEnglish(destCode) ? "" : " ";
  const ends: RegExp = notEnglish(srcCode) ? chnEnds : engEnds;
  const splitFunc = notEnglish(srcCode) ? splitChn : splitEng;
  if (sentences.length == 1) {
    const resultString = result.join(seprator);
    return { resultString, paragraphs: [resultString] };
  }

  const counts = sentences.map((sentence) =>
    countSentences(sentence, splitFunc)
  );
  if (sum(counts) != result.length) {
    return { resultString: result.join("\n"), paragraphs: result };
  }

  let resultString = "";
  let index = 0;
  let paragraphs: string[] = [];
  counts.forEach((count) => {
    let para = "";
    for (let i = 0; i < count; i++) {
      para += seprator + result[index].trim();
      index++;
    }
    paragraphs.push(para);
    resultString += para;
    resultString += "\n";
  });
  return { resultString, paragraphs };
}

export function reSegment(
  text: string,
  result: string[],
  srcCode: string,
  destCode: string
): { resultString: string; paragraphs: string[] } {
  const splitFunc = notEnglish(srcCode) ? splitChn : splitEng;
  const splitDstFunc = notEnglish(destCode) ? splitChn : splitEng;
  const src_sentences = text
    .split("\n")
    .filter((sentence) => sentence.length > 0);
  const dst_sentences = splitDstFunc(result.join("")).filter(
    (sentence) => trim(sentence, "？。！?.! ").length > 0
  );
  const seprator = notEnglish(destCode) ? "" : " ";
  const ends: RegExp = notEnglish(srcCode) ? chnEnds : engEnds;

  if (src_sentences.length == 1) {
    const resultString = result.join(seprator);
    return { resultString, paragraphs: [resultString] };
  }

  const src_counts = src_sentences.map((sentence) =>
    countSentences(sentence, splitFunc)
  );

  const dest_counts = result.map((sentence) =>
    countSentences(sentence, splitDstFunc)
  );

  if (sum(src_counts) != sum(dest_counts)) {
    return { resultString: result.join("\n"), paragraphs: result };
  }

  let resultString = "";
  let index = 0;
  let paragraphs: string[] = [];
  src_counts.forEach((count) => {
    let para = "";
    for (let i = 0; i < count; i++) {
      para += seprator + dst_sentences[index].trim();
      index++;
    }
    paragraphs.push(para);
    resultString += para;
    resultString += "\n";
  });

  return {
    resultString,
    paragraphs,
  };
}

export function autoReSegment(result: TranslateResult): CopyTranslateResult {
  let segmentFunc = reSegment;
  if (result.engine == "google") {
    segmentFunc = reSegmentGoogle;
  }
  let { resultString, paragraphs } = segmentFunc(
    result.text,
    result.trans.paragraphs,
    result.from,
    result.to
  );
  paragraphs = paragraphs.filter(
    (sentence) => trim(sentence, "？。！?.! \n").length > 0
  );
  paragraphs = paragraphs.map((sentence) =>
    trimstart(sentence.trim(), "？。！?.!")
  );
  resultString = paragraphs.join("\n");
  let new_result = { ...result, resultString };
  new_result.trans.paragraphs = paragraphs;
  return new_result;
}

const patterns: Array<RegExp> = [/([?!.])[ ]?\n/g, /([？！。])[ ]?\n/g]; //The first one is English like, the second is for Chinese like.
export const sentenceEnds = /#([?？！!.。])#/g;

export function isChinese(src: string) {
  /*校验是否中文名称组成 */
  const reg = /^[\u4E00-\u9FA5]{2,4}$/; /*定义验证表达式*/
  return reg.test(src); /*进行验证*/
}

export function normalizeAppend(src: string, purify = true) {
  if (!purify) return src.trim().replace(/\r/, "");
  src = src.replace(/\r\n/g, "\n");
  src = src.replace(/\r/g, "\n");
  src = src.replace(/-\n/g, "");
  patterns.forEach(function (e) {
    src = src.replace(e, "#$1#");
  });
  src = src.replace(/\n/g, " ");
  src = src.replace(sentenceEnds, "$1\n");
  return src;
}

export function checkIsWord(text: string) {
  if (text.length > 100) {
    return false;
  }
  if (/^[a-zA-Z0-9 ]+$/.test(text) && text.split(" ").length <= 3) {
    return true;
  } else {
    return false;
  }
}
