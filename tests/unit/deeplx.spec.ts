jest.mock("@/common/translate/types", () => {
  class MockBaseTranslator<TConfig> {
    axios: any;
    constructor(axios: any) {
      this.axios = axios;
    }
  }

  class MockTranslateError extends Error {
    code: string;
    constructor(code: string) {
      super(code);
      this.code = code;
    }
  }

  return {
    BaseTranslator: MockBaseTranslator,
    TranslateError: MockTranslateError,
  };
});

import { DeepLX, mapLanguageToDeepLX } from "@/common/translate/deeplx";

describe("DeepLX translator", () => {
  it("posts to configured URL and converts data to TranslateQueryResult", async () => {
    const post = jest.fn().mockResolvedValue({
      data: {
        data: "你好，世界！",
        source_lang: "EN",
        target_lang: "ZH",
      },
    });
    const translator = new DeepLX({
      axios: { post },
      config: {
        url: "https://api.deeplx.org/demo-token/translate",
      },
    });

    const result = await (translator as any).query(
      "Hello, world!",
      "en",
      "zh-CN",
      {
        url: "https://api.deeplx.org/demo-token/translate",
      }
    );

    expect(post).toHaveBeenCalledWith(
      "https://api.deeplx.org/demo-token/translate",
      {
        text: "Hello, world!",
        source_lang: "EN",
        target_lang: "ZH",
      },
      expect.objectContaining({
        headers: { "Content-Type": "application/json" },
        timeout: 30000,
      })
    );
    expect(result.trans.paragraphs).toEqual(["你好，世界！"]);
    expect(result.origin.paragraphs).toEqual(["Hello, world!"]);
    expect(result.from).toBe("en");
    expect(result.to).toBe("zh-CN");
  });

  it("throws when response data is missing", async () => {
    const translator = new DeepLX({
      axios: {
        post: jest.fn().mockResolvedValue({
          data: { source_lang: "EN", target_lang: "ZH" },
        }),
      },
      config: {
        url: "https://api.deeplx.org/demo-token/translate",
      },
    });

    await expect(
      (translator as any).query("Hello", "en", "zh-CN", {
        url: "https://api.deeplx.org/demo-token/translate",
      })
    ).rejects.toBeTruthy();
  });
});

describe("mapLanguageToDeepLX", () => {
  it("maps common CopyTranslator language codes to DeepLX values", () => {
    expect(mapLanguageToDeepLX("auto")).toBe("auto");
    expect(mapLanguageToDeepLX("en")).toBe("EN");
    expect(mapLanguageToDeepLX("zh-CN")).toBe("ZH");
    expect(mapLanguageToDeepLX("zh-TW")).toBe("ZH-HANT");
    expect(mapLanguageToDeepLX("pt")).toBe("PT");
  });
});
