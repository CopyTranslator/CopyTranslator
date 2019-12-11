import { getDictionary } from "../src/tools/dictionary/engines";

describe("#Bing Dictionary test", () => {
  const bing = require(`eazydict-bing`);
  bing("hello", {}).then((res: any) => {
    console.log(res);
  });
  it("query", async () => {
    const engine = getDictionary("youdao");
    engine.query("what").then((res: any) => {
      console.log(res);
      expect(res.code).toBe(0);
    });
  });
});

describe("#Youdao Dictionary test", () => {
  it("query", async () => {
    const engine = getDictionary("youdao");
    engine.query("what").then((res: any) => {
      expect(res.code).toBe(0);
    });
  });
});

describe("#Google Dictionary test", () => {
  it("query", async () => {
    const engine = getDictionary("google");
    engine.query("what").then((res: any) => {
      expect(res.code).toBe(0);
    });
  });
});
