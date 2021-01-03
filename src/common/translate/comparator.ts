import eventBus from "../event-bus";
import { Compound } from "./compound";
import { CopyTranslator, CopyTranslateResult } from "./types";
import { TranslatorType } from "@/common/types";
import store from "@/store";
const Diff = require("diff");

export class Comparator {
  compound: Compound;
  constructor(compound: Compound) {
    this.compound = compound;
    eventBus.on("allTranslated", () => {
      const resultBuffer = this.compound.resultBuffer;
      let results = new Map<TranslatorType, CopyTranslateResult>();
      resultBuffer.forEach(function (value, key, map) {
        if (!!value) {
          results.set(key, value);
        }
      });
      this.compareAll(results);
    });
  }

  compareAll(results: Map<TranslatorType, CopyTranslateResult>) {
    let engines = [...results.keys()];
    engines.sort();
    let anchor = this.compound.mainEngine;
    if (!engines.includes(anchor)) {
      anchor = engines[0];
    }
    engines[engines.indexOf(anchor)] = engines[0];
    engines[0] = anchor;
    let anchorResult = results.get(anchor) as CopyTranslateResult;
    const compareResults = [];
    for (let engine of engines) {
      let parts: any = undefined;
      if (engine == anchor) {
        parts = this.compare(
          results.get(engines[1]) as CopyTranslateResult,
          anchorResult
        );
      } else {
        let targetResult = results.get(engine) as CopyTranslateResult;
        parts = this.compare(anchorResult, targetResult);
      }

      compareResults.push({
        engine,
        parts: parts,
      });
    }
    store.dispatch("setDiff", {
      text: this.compound.text,
      allParts: compareResults,
    });
  }

  compare(
    anchorResult: CopyTranslateResult,
    targetResult: CopyTranslateResult
  ) {
    let anchorParas = anchorResult.trans.paragraphs;
    let targetParas = targetResult.trans.paragraphs;
    let all_parts = [];
    if (anchorParas.length != targetParas.length) {
      anchorParas = [anchorResult.resultString];
      targetParas = [targetResult.resultString];
    }
    for (let i = 0; i < anchorParas.length; i++) {
      let diffParts = Diff.diffWords(anchorParas[i], targetParas[i]);
      diffParts = diffParts.filter((p: any) => !p.removed);
      all_parts.push(diffParts);
    }
    return all_parts;
  }
}
