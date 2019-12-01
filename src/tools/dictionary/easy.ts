import { WordEngine, DictResult, DictionaryType } from "./types";
const youdao = require("eazydict-youdao");
const google = require("eazydict-google");
const bing = require("eazydict-bing");

const engine_funcs = {
  bing: bing,
  google: google,
  youdao: youdao
};

export class EasyEngine extends WordEngine {
  engine_func: Function;
  name: DictionaryType;
  constructor(engine: DictionaryType) {
    super();
    this.engine_func = engine_funcs[engine];
    this.name = engine;
  }

  async query(words: string): Promise<DictResult> {
    return this.engine_func(words, {}).then(
      (res: any) => {
        return Promise.resolve({
          phonetics: res.phonetics,
          explains: res.translates,
          examples: res.examples,
          code: res.error.code,
          engine: this.name,
          url: res.url,
          words: words
        });
      },
      (res: any) => {
        return Promise.reject({ words: words, code: -1, engine: this.name });
      }
    );
  }
}

// export class BingEngine extends EasyEngine {
//   constructor() {
//     super("bing");
//   }
// }

export class GoogleEngine extends EasyEngine {
  constructor() {
    super("google");
  }
}

export class YoudaoEngine extends EasyEngine {
  constructor() {
    super("youdao");
  }
}
