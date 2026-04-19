# DeepLX Startup Fix Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Restore `npm run electron:serve` startup for the DeepLX integration by removing syntax that the current Electron 8 / webpack 4 main-process build cannot parse.

**Architecture:** Keep the existing build pipeline unchanged and make the new `DeepLX` translator source compatible with the repo's current TypeScript-to-webpack flow. Add one focused regression test for constructor/query behavior, then replace optional chaining in `deeplx.ts` with equivalent legacy-safe property access.

**Tech Stack:** Vue CLI 4, Electron 8, webpack 4, TypeScript 4.1, Jest

---

### Task 1: Lock in the regression coverage

**Files:**
- Modify: `tests/unit/deeplx.spec.ts`
- Test: `tests/unit/deeplx.spec.ts`

- [ ] **Step 1: Write the failing test**

```ts
it("uses empty-string fallbacks when config or response fields are missing", async () => {
  const translator = new DeepLX({
    axios: {
      post: jest.fn().mockResolvedValue({
        data: {
          data: "",
        },
      }),
    },
    config: undefined,
  });

  expect(translator.config.url).toBe("");

  await expect(
    (translator as any).query("Hello", "en", "zh-CN", {
      url: "https://api.deeplx.org/demo-token/translate",
    })
  ).rejects.toBeTruthy();
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test:unit -- tests/unit/deeplx.spec.ts`
Expected: FAIL because the current `deeplx.ts` implementation still uses optional chaining and the build/test pipeline should reject or fail before the assertion path is trusted.

- [ ] **Step 3: Write minimal implementation**

```ts
constructor(options: { axios: any; config: any }) {
  super(options.axios);
  this.config.url =
    options.config && options.config.url ? options.config.url : "";
}

const responseData = response && response.data ? response.data : undefined;
const translatedText =
  responseData && typeof responseData.data === "string"
    ? responseData.data
    : "";
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm run test:unit -- tests/unit/deeplx.spec.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add tests/unit/deeplx.spec.ts src/common/translate/deeplx.ts docs/superpowers/plans/2026-04-18-deeplx-startup-fix.md
git commit -m "fix: restore deeplx startup compatibility"
```

### Task 2: Verify the application startup path

**Files:**
- Modify: `src/common/translate/deeplx.ts`
- Test: `package.json`

- [ ] **Step 1: Run the targeted startup command under the compatible Node version**

Run: `fnm env --use-on-cd | Out-String | Invoke-Expression; fnm use v12.22.12; npm run electron:serve`
Expected: the previous parse error for `src/common/translate/deeplx.ts` no longer appears.

- [ ] **Step 2: Inspect remaining output**

Run: `fnm env --use-on-cd | Out-String | Invoke-Expression; fnm use v12.22.12; npm run electron:serve`
Expected: any remaining output is unrelated warning noise; there is no `Module parse failed` pointing at `deeplx.ts`.

- [ ] **Step 3: Stop after verification and record actual status**

Run: `git status --short`
Expected: only the planned files are modified for this fix.

- [ ] **Step 4: Commit**

```bash
git add tests/unit/deeplx.spec.ts src/common/translate/deeplx.ts docs/superpowers/plans/2026-04-18-deeplx-startup-fix.md
git commit -m "fix: restore deeplx startup compatibility"
```
