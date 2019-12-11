import { Compound } from "../src/tools/translate/compound";
describe("#Compound test", () => {
  it("query", async () => {
    const engine = new Compound("youdao");
    const result = await engine.translate(
      "what are you talking about?",
      "auto",
      "zh-CN"
    );
    console.log(result);
    // console.log(engine.resultBuffer);
  });
});
