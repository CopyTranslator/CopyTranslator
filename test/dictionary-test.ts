import { describe, it } from "mocha";
import { expect } from "chai";
import { engines, WordEngineType } from "../src/tools/dictionaries";

const engine = new engines[WordEngineType.Bing]();

describe("#Dictionary test", () => {
  describe("query", () => {
    it("should return code 0", () => {
      engine.query("what are you talking about?").then((res: any) => {
        expect(res.code).to.equal(0);
      });
    });
  });
});
