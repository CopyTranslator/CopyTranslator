import { WordEngine, QueryDictResult, DictionaryType } from "./types";
import { getDictionary, dictionaries } from "./engines";

export class Polymer {
  mainEngine: WordEngine;
  resultBuffer = new Map<DictionaryType, QueryDictResult | undefined>();
  words: string | undefined;

  constructor(engineType: DictionaryType = "google") {
    this.mainEngine = getDictionary(engineType);
  }

  query(words: string): Promise<QueryDictResult> {
    this.words = words;
    for (const [name, engine] of dictionaries.entries()) {
      if (name === this.mainEngine.name) {
        continue;
      }
      engine
        .query(words)
        .then((res) => {
          this.resultBuffer.set(res.engine, res);
        })
        .catch(() => {
          this.resultBuffer.set(engine.name, undefined);
        });
    }
    this.resultBuffer.set(this.mainEngine.name, undefined);
    return this.mainEngine.query(words).then((res) => {
      this.resultBuffer.set(res.engine, res);
      return res;
    });
  }
  getBuffer(engine: DictionaryType) {
    return this.resultBuffer.get(engine) as QueryDictResult;
  }

  setMainEngine(engineType: DictionaryType) {
    this.mainEngine = getDictionary(engineType);
  }
}
