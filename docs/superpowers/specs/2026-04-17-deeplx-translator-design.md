# DeepLX 内置翻译器设计

**日期：** 2026-04-17

**目标：** 在 `CopyTranslator v12.1.0` 中新增一个内置 `DeepLX` 翻译器，使其像现有百度、谷歌、DeepL 等翻译器一样出现在翻译器管理界面中，并支持用户通过填写完整的第三方托管 `DeepLX` URL 直接发起翻译请求。

## 背景与问题定义

当前项目已经存在两类翻译器扩展路径：

- 内置翻译器：由类型定义、配置规则、翻译器注册表、翻译器元数据和本地化文案共同驱动。
- 自定义 AI 供应商：围绕 OpenAI 兼容接口的 `apiBase + apiKey + model` 架构展开。

`DeepLX` 不属于 OpenAI 兼容模型供应商，而是一个固定 `POST /translate` 风格的 HTTP 翻译接口。将其强行接入 AI 供应商体系会导致界面上出现模型、供应商、刷新模型等与 `DeepLX` 无关的概念，也会让后续维护变得混乱。

用户当前的实际使用场景不是本地自部署标准 `DeepLX`，而是第三方社区托管的服务实例。该实例使用完整 URL 作为实际请求入口，例如：

`https://api.deeplx.org/<token>/translate`

在这个场景中，路径已经携带了访问令牌，因此单独的 `API` 字段对请求本身没有必要价值。

## 需求范围

本次实现只覆盖以下范围：

- 新增一个名为 `deeplx` 的内置翻译器。
- 在翻译器管理界面中显示 `DeepLX`，支持启用、缓存、分组、后备翻译器等现有机制。
- 在配置界面中仅暴露一个配置项：完整 `DeepLX URL`。
- 请求时直接向该 URL 发送 `POST` 请求。
- 请求体包含 `text`、`source_lang`、`target_lang`。
- 复用项目现有的全局源语言/目标语言选择，不为 `DeepLX` 单独新增语言配置界面。

本次实现明确不包含：

- 单独的 `API` 字段。
- 为 URL 自动拼接 token。
- 自定义请求头、查询参数、额外鉴权模式的配置。
- 将 `DeepLX` 纳入 AI 供应商体系。
- 引入通用 REST 翻译器抽象框架。

## 设计决策

### 1. 接入方式

`DeepLX` 作为内置翻译器接入，沿用当前项目已有的内置翻译器扩展路径：

- 在 `src/common/types.ts` 中注册 `deeplx` 类型。
- 在 `src/common/configuration.ts` 中新增 `deeplx` 的结构化配置规则。
- 在 `src/common/translate/translators.ts` 中注册 `deeplx` 的创建器。
- 在 `src/common/translate/metadata.ts` 中增加显示名称元数据。
- 在 `src/common/locales.ts` 中增加中英文名称、提示与字段标签。
- 新增 `src/common/translate/deeplx.ts` 作为实际实现文件。

这样可以保证 `DeepLX` 自动接入以下现有能力：

- 翻译器列表展示
- 配置展开面板
- 配置校验
- 启用/禁用状态
- 缓存分组、对比分组、双击分组
- 后备翻译器选择

### 2. 配置模型

`DeepLX` 配置仅包含一个字段：

- `url`: 完整可请求地址，例如 `https://api.deeplx.org/<token>/translate`

不再保留 `apiBase`、`apiKey` 或单独 `token` 字段。原因如下：

- 用户的实际使用场景依赖第三方托管格式，完整 URL 已经包含访问路径。
- 如果保留单独 token 字段而默认不参与请求，会造成配置语义冗余。
- 当前目标是最小实现，避免先引入标准 `DeepLX` 与第三方托管地址的双配置模式。

### 3. 请求协议

请求方式：

- 方法：`POST`
- 地址：用户配置的完整 `url`
- `Content-Type`：`application/json`

请求体字段：

- `text`
- `source_lang`
- `target_lang`

其中：

- `text` 直接取待翻译文本
- `source_lang` 取当前全局源语言；若为自动检测，则传 `auto`
- `target_lang` 取当前全局目标语言

### 4. 语言码处理

`CopyTranslator` 的语言值与第三方 `DeepLX` 服务支持的语言码可能并不完全一致，因此实现中需要一层最小语言归一化逻辑。目标不是建立一套巨大的专用语言配置，而是：

- 优先复用现有全局源语言/目标语言值
- 对常见值做轻量归一化，例如：
  - `auto` -> `auto`
  - `zh-CN` -> `ZH`
  - `zh-TW` -> `ZH-HANT` 或在服务不支持时回退到 `ZH`
  - `en` -> `EN`
  - `pt` -> `PT`
- 对大小写做统一处理

如果遇到未显式映射的语言，优先采用大写并透传；若服务端返回不支持错误，则由现有翻译失败路径处理。

### 5. 响应解析

第三方 `DeepLX` 托管服务通常返回与官方文档近似的结构，核心字段一般为：

- `data`: 翻译后的文本
- `source_lang`
- `target_lang`

实现应优先读取 `data`，并将其包装为项目现有 `TranslateResult` 兼容格式。

如果响应缺少 `data` 或类型不合法，则抛出翻译错误，交由现有错误提示与 fallback 机制处理。

### 6. 校验与错误处理

配置校验规则：

- `url` 必填
- 必须是字符串
- 去除首尾空白后不能为空

本次不强制做严格 URL 正则校验。原因是：

- 第三方托管实例的 URL 形式可能多样
- 严格校验更容易误伤可用地址
- 运行时请求失败已经能给出更真实的反馈

错误处理：

- 网络错误、超时、HTTP 非 2xx、无效响应体，统一抛出翻译失败
- 不在 `DeepLX` 内部偷偷切换备用鉴权方式
- 不在 `DeepLX` 内部自行回退到其他翻译器；后备翻译器仍由现有上层机制控制

## 文件变更边界

预计涉及以下文件：

- 修改 `src/common/types.ts`
  - 注册 `deeplx` 为内置翻译器类型
- 修改 `src/common/configuration.ts`
  - 新增 `deeplx` 配置规则
- 修改 `src/common/translate/translators.ts`
  - 注册 `deeplx` 创建器
- 新增 `src/common/translate/deeplx.ts`
  - 实现 `DeepLX` HTTP 调用、语言归一化和结果解析
- 修改 `src/common/translate/metadata.ts`
  - 增加 `DeepLX` 元数据
- 修改 `src/common/locales.ts`
  - 增加中英文文案和配置字段标签

按当前设计，不需要修改：

- `src/views/TranslatorManager.vue`
- `src/components/KeyConfig.vue`
- `src/components/CustomTranslatorManager.vue`

原因是现有内置翻译器渲染逻辑已经是配置驱动的，只要类型和配置规则接入完成，UI 会自动渲染出来。

## 测试策略

至少验证以下行为：

1. `deeplx` 出现在翻译器管理列表中。
2. 展开配置面板后，只显示一个 URL 输入项。
3. URL 为空时不能启用。
4. URL 保存后可以启用。
5. 发起翻译时会向配置的完整 URL 发送 `POST` 请求。
6. 请求体包含 `text`、`source_lang`、`target_lang`。
7. 响应体 `data` 能正确转为项目使用的翻译结果。
8. 响应异常时会进入现有错误处理路径。

如果当前仓库缺少针对翻译器模块的现成单元测试基础设施，则本次至少应保证：

- 实现文件结构清晰，便于后续补测
- 通过最小可运行验证确认请求路径与结果解析正确

## 风险与后续扩展

### 已知风险

- 第三方托管 `DeepLX` 服务的行为未必完全遵循官方文档。
- 不同服务实例对中文繁简或目标语言码的支持可能不同。
- 若第三方实例未来改成 query/header token 鉴权，当前“单 URL”模型需要调整。

### 后续可扩展方向

若后续确实需要兼容更多 `DeepLX` 部署形态，可以在不破坏当前设计的前提下扩展为：

- `url` + `tokenMode` + `token`
- 标准 `/translate` 模式与第三方路径 token 模式并存
- 更完整的语言映射表

但这些都不属于当前最小可用范围。

## 实施结论

当前最合适的实现方案是：

- 将 `DeepLX` 作为新的内置翻译器 `deeplx` 接入
- 配置项只保留一个完整 `DeepLX URL`
- 不保留单独 `API` 字段
- 直接向该 URL 发送标准 `POST` 翻译请求
- 复用现有全局语言选择、分组、缓存和后备翻译器机制

该方案与用户当前的第三方托管服务用法一致，改动面小，界面语义清晰，也最符合当前项目已有的内置翻译器架构。
