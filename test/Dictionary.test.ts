import { getEngine, WordEngineType } from "../src/tools/dictionaries";

describe("#Bing Dictionary test", () => {
  it("query", () => {
    const engine = getEngine(WordEngineType.Bing);
    engine.query("what are you talking about?").then((res: any) => {
      expect(res.code).toBe(0);
    });
  });
});

describe("#Youdao Dictionary test", () => {
  it("query", () => {
    const engine = getEngine(WordEngineType.Youdao);
    engine.query("what are you talking about?").then((res: any) => {
      expect(res.code).toBe(0);
    });
  });
});

describe("#Google Dictionary test", () => {
  it("query", () => {
    const engine = getEngine(WordEngineType.Google);
    engine.query("what are you talking about?").then((res: any) => {
      expect(res.code).toBe(0);
    });
  });
});
