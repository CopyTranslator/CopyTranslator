import { ResultBuffer, SharedResult } from "@/common/translate/types";
import { getConfigByKey } from "@/store";
const Diff = require("diff");

export type CompareResult = {
  [key: string]: any;
};

export function compareAll(results: ResultBuffer): CompareResult {
  let engines = Object.keys(results);
  engines.sort();
  let anchor = getConfigByKey("translatorType");
  if (!engines.includes(anchor)) {
    anchor = engines[0];
  }
  engines[engines.indexOf(anchor)] = engines[0]; //换一下位置
  engines[0] = anchor;

  let anchorResult = results[anchor] as SharedResult;
  const compareResult: CompareResult = {};
  for (let engine of engines) {
    let parts: any = compare(anchorResult, results[engine]);
    compareResult[engine] = parts;
  }
  return compareResult;
}

function compare(anchorResult: SharedResult, targetResult: SharedResult) {
  let anchorParas = anchorResult.transPara;
  let targetParas = targetResult.transPara;
  let all_parts = [];
  if (anchorParas.length != targetParas.length) {
    anchorParas = [anchorResult.translation];
    targetParas = [targetResult.translation];
  }
  const diffFunc = anchorResult.chineseStyle ? Diff.diffChars : Diff.diffWords; //chinese style的话，是逐个字符比较
  for (let i = 0; i < anchorParas.length; i++) {
    let diffParts = diffFunc(anchorParas[i], targetParas[i]);
    diffParts = diffParts.filter((p: any) => !p.removed);
    all_parts.push(diffParts);
  }
  return all_parts;
}
