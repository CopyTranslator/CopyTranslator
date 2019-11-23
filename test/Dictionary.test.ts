import { getDictionary } from "../src/tools/dictionaries/engines";

describe("#Bing Dictionary test", () => {
  it("query", () => {
    const engine = getDictionary("bing");
    engine.query("what are you talking about?").then((res: any) => {
      expect(res.code).toBe(0);
    });
  });
});

describe("#Youdao Dictionary test", () => {
  it("query", () => {
    const engine = getDictionary("youdao");
    engine.query("what are you talking about?").then((res: any) => {
      expect(res.code).toBe(0);
    });
  });
});

describe("#Google Dictionary test", () => {
  it("query", () => {
    const engine = getDictionary("google");
    engine.query("what are you talking about?").then((res: any) => {
      expect(res.code).toBe(0);
    });
  });
});
