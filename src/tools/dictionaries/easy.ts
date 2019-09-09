import { WordEngine, DictResult } from "./types";

export class EasyEngine extends WordEngine {
  engine_func: Function;
  engine: string;
  constructor(engine: string) {
    super();
    this.engine_func = require(`eazydict-${engine}`);
    this.engine = engine;
  }

  async query(words: string): Promise<DictResult> {
    return this.engine_func(words, {}).then(
      (res: any) => {
        return Promise.resolve({
          phonetics: res.phonetics,
          explains: res.translates,
          examples: res.examples,
          code: res.error.code,
          engine: this.engine,
          url: res.url,
          words: words
        });
      },
      (res: any) => {
        return Promise.reject({ words: words, code: -1, engine: this.engine });
      }
    );
  }
}

export class BingEngine extends EasyEngine {
  constructor() {
    super("bing");
  }
}

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
