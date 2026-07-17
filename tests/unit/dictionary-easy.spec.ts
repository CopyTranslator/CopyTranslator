import * as fs from "fs";
import * as path from "path";
import * as ts from "typescript";

const mockBingQuery = jest.fn();
const mockGoogleQuery = jest.fn();
const mockYoudaoQuery = jest.fn();

jest.mock("eazydict-bing", () => mockBingQuery);
jest.mock("eazydict-google", () => mockGoogleQuery);
jest.mock("eazydict-youdao", () => mockYoudaoQuery);

import { BingEngine, EasyEngine, YoudaoEngine } from "@/common/dictionary/easy";

const dictionaryResponse = {
  phonetics: [{ type: "美", value: "[test]" }],
  translates: [{ type: "n", trans: "测试" }],
  examples: [],
  error: { code: 0 },
  url: "https://example.com",
};

describe("EasyEngine", () => {
  beforeEach(() => {
    mockBingQuery.mockReset();
    mockGoogleQuery.mockReset();
    mockYoudaoQuery.mockReset();
  });

  const cases: Array<[string, () => EasyEngine, jest.Mock]> = [
    ["bing", () => new BingEngine(), mockBingQuery],
    ["google", () => new EasyEngine("google" as any), mockGoogleQuery],
    ["youdao", () => new YoudaoEngine(), mockYoudaoQuery],
  ];

  it("declares dictionary modules as static webpack dependencies", () => {
    const file = path.resolve(__dirname, "../../src/common/dictionary/easy.ts");
    const source = ts.createSourceFile(
      file,
      fs.readFileSync(file, "utf8"),
      ts.ScriptTarget.Latest,
      true,
      ts.ScriptKind.TS
    );
    const modules: string[] = [];

    function visit(node: ts.Node) {
      const argument = ts.isCallExpression(node)
        ? node.arguments[0]
        : undefined;
      if (
        ts.isCallExpression(node) &&
        ts.isIdentifier(node.expression) &&
        node.expression.text === "require" &&
        node.arguments.length === 1 &&
        argument &&
        ts.isStringLiteral(argument)
      ) {
        modules.push(argument.text);
      }
      ts.forEachChild(node, visit);
    }

    visit(source);

    expect(modules.sort()).toEqual([
      "eazydict-bing",
      "eazydict-google",
      "eazydict-youdao",
    ]);
  });

  it.each(cases)(
    "loads the packaged %s dictionary module",
    async (_, createEngine, query) => {
      query.mockResolvedValue(dictionaryResponse);

      const result = await createEngine().query("test word");

      expect(query).toHaveBeenCalledWith("test word", {});
      expect(result).toMatchObject({
        words: "test word",
        explains: dictionaryResponse.translates,
        phonetics: dictionaryResponse.phonetics,
      });
    }
  );
});
