# 翻译实现机制完整分析

本文档对 CopyTranslator 的翻译实现进行端到端分析，覆盖主进程与渲染进程的数据流、动作与配置驱动方式、翻译与词典执行机制、多引擎缓存与对比、界面数据绑定、以及本地化资源生成与加载。目标是帮助后续开发者准确定位关键入口与修改点。

## 1. 架构分层与数据流

**进程与控制器**
- 主进程负责翻译、剪贴板、OCR 与配置响应：初始化 `TranslateController` 并安装本地化模块：[controller.ts](src/main/controller.ts#L35-L192)
- 渲染进程负责界面渲染与交互：通过代理将设置写回主进程：[controller.ts](src/renderer/controller.ts#L24-L113)

**状态与事件通道**
- 全局状态保存在 Vuex：翻译结果、词典结果、语言列表、结果缓冲区与配置：[store/index.ts](src/store/index.ts#L13-L86)
- 配置变更通过 `observePlugin` 通知观察者（主进程控制器与翻译控制器）：[observe.ts](src/store/plugins/observe.ts#L1-L31)
- 视图层的联动更新由 `updateViewPlugin` 触发，常见用于语言下拉菜单刷新：[update-view.ts](src/store/plugins/update-view.ts#L1-L41)

## 2. 动作与配置驱动链路

**动作分发**
- 动作从 UI 或快捷键触发，经 `ActionManager` 构造菜单/动作并通过事件总线分发：[action.ts](src/common/action.ts#L72-L456)
- 主进程 `Controller.handle` 负责路由动作，翻译相关操作转交给 `TranslateController.handle`：[controller.ts](src/main/controller.ts#L104-L177)、[translate-controller.ts](src/main/translate-controller.ts#L111-L178)

**配置与开关**
- 配置项规则由 `configuration.ts` 定义，包括翻译开关与引擎组设置：[configuration.ts](src/common/configuration.ts#L139-L236)
- 翻译相关配置变更最终由 `TranslateController.postSet` 触发实际行为切换：[translate-controller.ts](src/main/translate-controller.ts#L685-L738)

## 3. 翻译触发与输入处理

**触发来源**
- 显式动作：`translate`、`translateClipboard`、`doubleCopyTranslate` 等：[translate-controller.ts](src/main/translate-controller.ts#L111-L178)
- 剪贴板监听：开启后持续监听文本变更并触发翻译：[translate-controller.ts](src/main/translate-controller.ts#L635-L661)
- UI 触发：输入框 Ctrl+Enter 通过 `BaseView.translate` 发送动作：[BaseView.vue](src/components/BaseView.vue#L142-L152)、[ContrastPanel.vue](src/components/ContrastPanel.vue#L16-L79)

**文本预处理**
- `normalizeText` 负责净化文本与单词判定前处理：[translate-controller.ts](src/main/translate-controller.ts#L306-L312)
- 增量复制逻辑在 `setSrc` 中实现，针对中文与非中文拼接规则不同：[translate-controller.ts](src/main/translate-controller.ts#L196-L215)
- 长度与重复校验在 `checkLength`、`checkValid`、`matchAnyResults` 中控制：[translate-controller.ts](src/main/translate-controller.ts#L242-L274)

## 4. 语言决策与语言名称

**语言检测与智能互译**
- `decideLanguage` 结合用户配置、翻译器检测与繁简识别决定源/目标语言：[translate-controller.ts](src/main/translate-controller.ts#L386-L428)
- `smartTranslate` 当源/目标相同会尝试切换目标语言：[translate-controller.ts](src/main/translate-controller.ts#L418-L427)

**语言名称显示**
- 语言名称来自 `getLanguageLocales`，由 `@opentranslate2/languages` 的本地化字典提供：[locale.ts](src/common/translate/locale.ts#L1-L20)
- 翻译完成后 toast 显示语言名：[translate-controller.ts](src/main/translate-controller.ts#L493-L517)

## 5. 翻译执行与引擎调度

**翻译器注册**
- 内置翻译器集中注册在 `translatorMap`，用于统一实例化与配置更新：[translators.ts](src/common/translate/translators.ts#L18-L62)
- `translatorTypes` 与引擎组定义在类型模块中：[types.ts](src/common/types.ts#L85-L209)

**多引擎与后备策略**
- `Compound.translate` 根据支持语言过滤引擎，主引擎不支持则用 `fallbackTranslator`：[compound.ts](src/common/translate/compound.ts#L124-L209)
- 结果缓存由 `ResultBufferManager` 管理并同步到 Vuex：[compound.ts](src/common/translate/compound.ts#L17-L63)

**引擎组与多源模式**
- 翻译器组由 `translator-enabled`、`translator-cache`、`translator-compare` 等配置控制：[types.ts](src/common/types.ts#L204-L209)
- `TranslateController.translateSentence` 按当前模式选择引擎组：[translate-controller.ts](src/main/translate-controller.ts#L550-L570)

## 6. 词典系统与智能词典

**词典引擎聚合**
- `Polymer` 维护主词典引擎并并行查询其他引擎：[polymer.ts](src/common/dictionary/polymer.ts#L1-L40)
- 词典类型与结果结构定义于 `dictionary/types.ts`：[types.ts](src/common/dictionary/types.ts#L1-L56)
- 当前内置词典引擎由 `engines.ts` 注册：[engines.ts](src/common/dictionary/engines.ts#L1-L13)

**智能词典触发**
- `isWord` 判断是否进入词典模式，受 `smartDict` 与增量复制影响：[translate-controller.ts](src/main/translate-controller.ts#L519-L525)
- 词典查询与同步结果由 `queryDictionary` 完成：[translate-controller.ts](src/main/translate-controller.ts#L531-L548)

## 7. 结果同步、缓存与界面绑定

**结果同步**
- 翻译结果写入 Vuex 并触发通知，词典结果同步到 `dictResult`：[translate-controller.ts](src/main/translate-controller.ts#L489-L517)
- 多引擎缓存结果写入 `resultBuffer`：[compound.ts](src/common/translate/compound.ts#L17-L63)

**渲染层展示**
- `BaseView` 统一读取 `sharedResult`/`dictResult`/配置并定义模式切换逻辑：[BaseView.vue](src/components/BaseView.vue#L51-L171)
- 对照面板使用多布局展示源文本、译文、词典与对比视图：[ContrastPanel.vue](src/components/ContrastPanel.vue#L1-L257)
- 多源对比界面使用 `DiffTextArea` 读取 `resultBuffer` 并计算差异：[DiffTextArea.vue](src/components/DiffTextArea.vue#L87-L135)
- 词典界面由 `DictResult` 渲染：[DictResult.vue](src/components/DictResult.vue#L1-L46)
- 专注模式视图在 `Focus` 中处理译文与多源/词典展示：[Focus.vue](src/components/Focus.vue#L1-L138)

## 8. 本地化资源生成与加载

**资源定义与生成**
- 源码语言包在 `locales.ts` 中维护为 `Map`：[locales.ts](src/common/locales.ts#L1-L369)
- `prebuild.ts` 将语言包生成 `dist_locales`，并补齐缺失键：[prebuild.ts](src/prebuild.ts#L1-L44)
- 构建脚本在 `prebuild` 中执行：`tsc` + `node`：[package.json](package.json#L15-L22)

**运行时加载**
- `L10N` 在主进程加载系统与用户目录语言包并安装到 Vuex：[l10n.ts](src/main/l10n.ts#L23-L81)
- 语言包目录由运行环境决定：开发态 `dist_locales`，生产态 `resources/locales`，并包含用户目录：[env.ts](src/common/env.ts#L83-L116)
- Vuex 的 `l10n` 模块保存当前语言与语言列表：[l10n.ts](src/store/plugins/l10n.ts#L1-L55)

## 9. 扩展与修改建议

**新增翻译器**
- 内置翻译器：在 `translatorMap` 中注册实例：[translators.ts](src/common/translate/translators.ts#L18-L38)
- AI 供应商：通过 `translatorProviders` 配置扩展，使用 `CustomTranslatorManager` 自动展开模型：[custom-translators.ts](src/common/translate/custom-translators.ts#L41-L100)

**修改翻译触发机制**
- 入口动作集中在 `TranslateController.handle`：[translate-controller.ts](src/main/translate-controller.ts#L111-L178)
- 剪贴板监听在 `setWatch` 与 `checkClipboard`：[translate-controller.ts](src/main/translate-controller.ts#L276-L661)

**调整多引擎策略**
- 引擎组定义与设置入口在 `action.ts` 与 `types.ts`：[action.ts](src/common/action.ts#L322-L454)、[types.ts](src/common/types.ts#L204-L209)
- 翻译器切换与缓存命中处理在 `switchTranslator`：[translate-controller.ts](src/main/translate-controller.ts#L577-L613)

## 10. 关键文件索引

- 翻译控制器：[translate-controller.ts](src/main/translate-controller.ts)
- 翻译器调度与缓存：[compound.ts](src/common/translate/compound.ts)
- 翻译器注册与获取：[translators.ts](src/common/translate/translators.ts)
- 自定义翻译器（AI 供应商）：[custom-translators.ts](src/common/translate/custom-translators.ts)
- 词典引擎聚合：[polymer.ts](src/common/dictionary/polymer.ts)
- 多源对比计算：[comparator.ts](src/renderer/comparator.ts)
- 主要 UI 绑定：[BaseView.vue](src/components/BaseView.vue)
- 界面本地化加载：[l10n.ts](src/main/l10n.ts)
