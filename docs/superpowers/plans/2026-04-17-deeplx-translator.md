# DeepLX Translator Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 在 `CopyTranslator` 中新增一个内置 `DeepLX` 翻译器，用户只需配置完整 `DeepLX URL`，即可像现有内置翻译器一样启用和使用。

**Architecture:** 新增一个独立的 `DeepLX` 翻译器实现文件，通过现有内置翻译器链路接入类型系统、配置规则、翻译器注册表和本地化文案。界面不新增专用面板，而是复用 `TranslatorManager` 和 `KeyConfig` 的配置驱动渲染能力。

**Tech Stack:** TypeScript, Vue 2, Vue CLI unit tests (Jest), axios, CopyTranslator 现有配置/翻译器抽象

---

### Task 1: 为 DeepLX 请求与结果转换补测试骨架

**Files:**
- Create: `tests/unit/deeplx.spec.ts`
- Test: `tests/unit/deeplx.spec.ts`

- [ ] **Step 1: 写出第一个失败测试，固定 URL 调用、请求体和结果解析**

```ts
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

    const result = await (translator as any).query("Hello, world!", "en", "zh-CN", {
      url: "https://api.deeplx.org/demo-token/translate",
    });

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
```

- [ ] **Step 2: 运行测试，确认当前失败**

Run: `npm run test:unit -- --runInBand --testPathPattern=tests/unit/deeplx.spec.ts`

Expected: FAIL，报错包含 `Cannot find module '@/common/translate/deeplx'` 或 `DeepLX is not defined`

- [ ] **Step 3: 补第二个失败测试，固定错误处理**

```ts
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
```

- [ ] **Step 4: 再次运行测试，确认仍然失败但目标更明确**

Run: `npm run test:unit -- --runInBand --testPathPattern=tests/unit/deeplx.spec.ts`

Expected: FAIL，错误集中在 `deeplx.ts` 尚未实现

- [ ] **Step 5: 提交测试骨架**

```bash
git add tests/unit/deeplx.spec.ts
git commit -m "test: add DeepLX translator coverage"
```

### Task 2: 实现 DeepLX 翻译器并接入注册表

**Files:**
- Create: `src/common/translate/deeplx.ts`
- Modify: `src/common/translate/translators.ts`
- Modify: `src/common/types.ts`
- Test: `tests/unit/deeplx.spec.ts`

- [ ] **Step 1: 写最小实现文件，让测试能加载类和语言映射函数**

```ts
import { BaseTranslator, Language, TranslateQueryResult, TranslateError } from "./types";

const languageMap = new Map<Language, string>([
  ["auto", "auto"],
  ["zh-CN", "ZH"],
  ["zh-TW", "ZH-HANT"],
  ["en", "EN"],
  ["ja", "JA"],
  ["ko", "KO"],
  ["fr", "FR"],
  ["es", "ES"],
  ["ru", "RU"],
  ["de", "DE"],
  ["it", "IT"],
  ["pt", "PT"],
]);

export function mapLanguageToDeepLX(lang: Language): string {
  return languageMap.get(lang) || String(lang).toUpperCase();
}

export class DeepLX extends BaseTranslator<{ url: string }> {
  name = "deeplx";
  config = { url: "" };

  constructor(options: { axios: any; config: any }) {
    super(options.axios);
    this.config.url = options.config?.url || "";
  }

  getSupportLanguages(): Language[] {
    return ["auto", "zh-CN", "zh-TW", "en", "ja", "ko", "fr", "es", "ru", "de", "it", "pt"];
  }

  async detect(): Promise<Language> {
    return "auto";
  }

  protected async query(
    text: string,
    from: Language,
    to: Language,
    config: { url: string }
  ): Promise<TranslateQueryResult> {
    throw new Error("not implemented");
  }
}

export default DeepLX;
```

- [ ] **Step 2: 在类型系统中注册 `deeplx`**

```ts
export const normalTranslatorTypes = [
  "baidu",
  "google",
  "caiyun",
  "keyan",
  "baidu-domain",
  "youdao",
  "sogou",
  "stepfun",
  "niu",
  "aliyun",
  "azure",
  "deepl",
  "deeplx",
  "tencent",
  "tencentsmart",
  "yandex",
  "volc",
] as const;
```

- [ ] **Step 3: 在翻译器注册表中加入 `DeepLX` 创建器**

```ts
["deeplx", (c) => { const { DeepLX } = require("./deeplx"); return new DeepLX({ axios, config: c }); }],
```

- [ ] **Step 4: 实现真正的 HTTP 请求与结果转换**

```ts
protected async query(
  text: string,
  from: Language,
  to: Language,
  config: { url: string }
): Promise<TranslateQueryResult> {
  const url = (config.url || "").trim();
  if (!url) {
    throw new TranslateError("API_SERVER_ERROR");
  }

  const response = await this.axios.post(
    url,
    {
      text,
      source_lang: mapLanguageToDeepLX(from),
      target_lang: mapLanguageToDeepLX(to),
    },
    {
      headers: {
        "Content-Type": "application/json",
      },
      timeout: 30000,
    }
  );

  const translatedText = response?.data?.data;
  if (typeof translatedText !== "string" || translatedText.trim().length === 0) {
    throw new TranslateError("API_SERVER_ERROR");
  }

  return {
    text,
    from,
    to,
    origin: {
      paragraphs: text.split(/\n+/),
      tts: "",
    },
    trans: {
      paragraphs: translatedText.split(/\n+/),
      tts: "",
    },
  };
}
```

- [ ] **Step 5: 运行测试，确认新实现通过**

Run: `npm run test:unit -- --runInBand --testPathPattern=tests/unit/deeplx.spec.ts`

Expected: PASS，至少包含 `3 passed`

- [ ] **Step 6: 提交实现与注册表改动**

```bash
git add src/common/translate/deeplx.ts src/common/translate/translators.ts src/common/types.ts tests/unit/deeplx.spec.ts
git commit -m "feat: add DeepLX translator implementation"
```

### Task 3: 接入配置规则、元数据与本地化文案

**Files:**
- Modify: `src/common/configuration.ts`
- Modify: `src/common/translate/metadata.ts`
- Modify: `src/common/locales.ts`
- Test: `tests/unit/deeplx.spec.ts`

- [ ] **Step 1: 在配置规则中加入 `deeplx`，只暴露一个 URL 字段**

```ts
config.setRule(
  "deeplx",
  new StructRule<KeyConfig>(
    { url: "" },
    generalCheck,
    {
      url: { uiType: "text", label: "deeplxUrl" },
    },
    "deeplxConfigNote",
    "https://www.mintlify.com/OwO-Network/DeepLX"
  )
);
```

- [ ] **Step 2: 在翻译器元数据中加入显示名称**

```ts
export const builtInTranslatorMetadata: Record<string, { name: string }> = {
  baidu: { name: "百度翻译" },
  google: { name: "Google Translate" },
  keyan: { name: "Keyan" },
  youdao: { name: "有道翻译" },
  sogou: { name: "搜狗翻译" },
  caiyun: { name: "彩云小译" },
  aliyun: { name: "阿里云翻译" },
  azure: { name: "Azure Translator" },
  deepl: { name: "DeepL" },
  deeplx: { name: "DeepLX" },
  tencent: { name: "腾讯翻译君" },
  tencentsmart: { name: "腾讯交互翻译" },
  yandex: { name: "Yandex" },
  volc: { name: "火山翻译" },
  "baidu-domain": { name: "百度垂直领域翻译" },
  stepfun: { name: "阶跃星辰" },
  niu: { name: "小牛翻译" },
};
```

- [ ] **Step 3: 增加中英文文案和字段标签**

```ts
["deeplx", "DeepLX翻译"],
["deeplxUrl", "DeepLX URL"],
["deeplxConfigNote", "填写完整可请求的 DeepLX 地址，例如 https://example.com/<token>/translate"],
["<tooltip>deeplx", "兼容第三方托管或自部署的 DeepLX 翻译接口"],
```

```ts
["deeplx", "DeepLX Translate"],
["deeplxUrl", "DeepLX URL"],
["deeplxConfigNote", "Enter the full DeepLX request URL, for example https://example.com/<token>/translate"],
["<tooltip>deeplx", "Use a third-party hosted or self-hosted DeepLX translation endpoint"],
```

- [ ] **Step 4: 运行单测并做一次 lint 校验**

Run: `npm run test:unit -- --runInBand --testPathPattern=tests/unit/deeplx.spec.ts`

Expected: PASS

Run: `npm run lint -- src/common/translate/deeplx.ts src/common/translate/translators.ts src/common/configuration.ts src/common/types.ts src/common/translate/metadata.ts src/common/locales.ts tests/unit/deeplx.spec.ts`

Expected: PASS，无 lint error

- [ ] **Step 5: 提交配置与文案接入**

```bash
git add src/common/configuration.ts src/common/translate/metadata.ts src/common/locales.ts
git commit -m "feat: wire DeepLX translator config and locale"
```

### Task 4: 做最终联调验证并整理说明

**Files:**
- Modify: `docs/guide/12.1.0.md`
- Test: `tests/unit/deeplx.spec.ts`

- [ ] **Step 1: 在版本文档中补一条 DeepLX 接入说明**

```md
- 新增内置 DeepLX 翻译器，可在翻译器管理中直接启用，并通过完整 DeepLX URL 进行配置。
```

- [ ] **Step 2: 运行最终回归命令**

Run: `npm run test:unit -- --runInBand --testPathPattern=tests/unit/deeplx.spec.ts`

Expected: PASS

Run: `npm run lint -- src/common/translate/deeplx.ts src/common/translate/translators.ts src/common/configuration.ts src/common/types.ts src/common/translate/metadata.ts src/common/locales.ts tests/unit/deeplx.spec.ts`

Expected: PASS

- [ ] **Step 3: 手动验证界面配置项**

Run: `npm run electron:serve`

Expected:
- 翻译器管理列表中出现 `DeepLX`
- 展开后仅有一个 `DeepLX URL` 输入框
- URL 为空时不能启用
- 填入 URL 保存后可以启用

- [ ] **Step 4: 提交文档与收尾验证**

```bash
git add docs/guide/12.1.0.md
git commit -m "docs: mention DeepLX translator support"
```

## Self-Review

- Spec coverage:
  - 内置翻译器接入路径：Task 2 + Task 3 覆盖
  - 单 URL 配置模型：Task 3 覆盖
  - POST 请求与 `text/source_lang/target_lang`：Task 1 + Task 2 覆盖
  - 不引入单独 API 字段：Task 3 只添加 `url` 字段，已覆盖
  - 复用现有 UI：Task 3 + Task 4 的手动验证覆盖
- Placeholder scan:
  - 计划中没有 `TODO`、`TBD`、`later` 等占位描述
  - 所有代码步骤都包含了明确代码块
- Type consistency:
  - `deeplx` 作为统一 ID 出现在类型、配置、注册表、元数据和文案中
  - 配置字段统一为 `url`
  - 测试与实现使用同一个导出名：`DeepLX` 和 `mapLanguageToDeepLX`

