import { WordEngine, QueryDictResult, DictionaryType } from "./types";

const engine_modules = {
  bing: "eazydict-bing",
  google: "eazydict-google",
  youdao: "eazydict-youdao",
};

function loadEngine(moduleName: string): Function {
  switch (moduleName) {
    case "eazydict-bing":
      return require("eazydict-bing");
    case "eazydict-google":
      return require("eazydict-google");
    case "eazydict-youdao":
      return require("eazydict-youdao");
    default:
      throw Error(`Unknown dictionary module: ${moduleName}`);
  }
}

export class EasyEngine extends WordEngine {
  engine_func?: Function;
  name: DictionaryType;
  constructor(engine: DictionaryType) {
    super();
    this.name = engine;
  }

  async query(words: string): Promise<QueryDictResult> {
    if (!this.engine_func) {
        const moduleName = engine_modules[this.name];
        if (moduleName) {
            this.engine_func = loadEngine(moduleName);
        } else {
            return Promise.reject({ words: words, code: -1, engine: this.name, error: "Engine not found" });
        }
    }
    return this.engine_func!(words, {}).then(
      (res: any) => {
        return Promise.resolve({
          phonetics: res.phonetics,
          explains: res.translates,
          examples: res.examples,
          code: res.error.code,
          engine: this.name,
          url: res.url,
          words: words,
        });
      },
      (res: any) => {
        return Promise.reject({ words: words, code: -1, engine: this.name });
      }
    );
  }
}

export class BingEngine extends EasyEngine {
  constructor() {
    super("bing");
  }
}


export class YoudaoEngine extends EasyEngine {
  constructor() {
    super("youdao");
  }
}
