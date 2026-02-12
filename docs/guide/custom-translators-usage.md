# 自定义翻译器使用指南

## 概述

CopyTranslator 支持添加自定义的 OpenAI 兼容翻译器，让你可以使用各种 AI 模型进行翻译。

**✨ 新特性**：自定义翻译器现已完全集成到系统中，添加后会自动出现在主界面的引擎列表中，可以像内置翻译器一样使用！

## 使用方式

### 方式一：通过 UI 界面（推荐）

1. **打开自定义翻译器管理界面**
   - 在设置中找到"自定义翻译器"选项
   - 点击 CustomTranslatorManager 组件

2. **添加新的翻译器**
   - 点击"添加翻译器"按钮
   - 选择提供商（OpenAI、DeepSeek、Moonshot 等）或选择"自定义"
   - 填写配置信息：
     - **翻译器名称**: 显示名称（如 `我的 GPT-4`）- ID 会自动生成
     - **API Base**: API 基础地址
     - **API Key**: 你的 API 密钥
     - **模型**: 
       - 🆕 点击刷新按钮 🔄 自动获取可用模型列表
       - 或从推荐列表中选择
       - 或手动输入模型名称

3. **高级配置（可选）**
   - **Temperature**: 控制翻译的创造性（0-1）
     - 0-0.2: 非常确定性，适合准确翻译
     - 0.2-0.5: 平衡准确性和多样性
     - 0.5-0.8: 较有创造性
     - 0.8-1.0: 非常有创造性
   - **Max Tokens**: 最大生成令牌数
   - **Prompt**: 自定义提示词（可选）

4. **测试翻译器**
   - 点击"测试"按钮
   - 输入测试文本
   - 选择源语言和目标语言
   - 查看翻译结果

5. **使用翻译器**
   - 添加成功后，自定义翻译器会自动出现在主界面的引擎按钮中
   - 点击对应的引擎按钮即可切换到该翻译器
   - 鼠标悬停在按钮上会显示翻译器名称

### 方式二：编程方式

```typescript
import { customTranslatorManager } from "@/common/translate/custom-translators";
import { getTranslator } from "@/common/translate/translators";

// 1. 添加翻译器（ID 可以手动指定或自动生成）
customTranslatorManager.addTranslator({
  id: "my-gpt4",  // 可选：不提供则自动生成
  name: "我的 GPT-4",
  type: "openai",
  config: {
    apiBase: "https://api.openai.com/v1",
    apiKey: "your-api-key-here",
    model: "gpt-4",
    temperature: 0.3,
    maxTokens: 4000,
    prompt: "default",
  },
});

// 或者让系统自动生成 ID
const id = customTranslatorManager.generateUniqueId("gpt4");
customTranslatorManager.addTranslator({
  id: id,
  name: "我的 GPT-4",
  type: "openai",
  config: { /* ... */ },
});

// 2. 使用翻译器
const translator = getTranslator("my-gpt4");
const result = await translator.translate("Hello", "en", "zh-CN");
console.log(result.trans.paragraphs);
```

### 方式三：使用工具函数

```typescript
import { addOpenAITranslator, addDeepSeekTranslator } from "@/common/translate/custom-translators-utils";

// 快速添加 OpenAI 翻译器（ID 会自动生成）
addOpenAITranslator({
  name: "GPT-4",
  apiKey: "your-key",
  model: "gpt-4",
  // id: "custom-id", // 可选：手动指定 ID
});

// 快速添加 DeepSeek 翻译器（使用默认 ID "deepseek"）
addDeepSeekTranslator({
  apiKey: "your-key",
});
```

## 支持的 API 提供商

系统支持所有兼容 OpenAI API 格式的服务：

### OpenAI 官方
- API Base: `https://api.openai.com/v1`
- 模型: `gpt-4`, `gpt-3.5-turbo` 等

### DeepSeek
- API Base: `https://api.deepseek.com/v1`
- 模型: `deepseek-chat`, `deepseek-coder`

### Moonshot (月之暗面)
- API Base: `https://api.moonshot.cn/v1`
- 模型: `moonshot-v1-8k`, `moonshot-v1-32k`

### 智谱 AI
- API Base: `https://open.bigmodel.cn/api/paas/v4`
- 模型: `glm-4`, `glm-3-turbo`

### 阿里云 DashScope
- API Base: `https://dashscope.aliyuncs.com/compatible-mode/v1`
- 模型: `qwen-plus`, `qwen-turbo`, `qwen-max`

### Azure OpenAI
- API Base: `https://your-resource.openai.azure.com/openai/deployments/your-deployment?api-version=2023-05-15`
- 模型: 你的部署名称

### 其他兼容服务
只要 API 格式兼容 OpenAI 的服务都可以使用，比如：
- LocalAI
- Ollama (with OpenAI adapter)
- vLLM
- 各类代理服务

## 配置示例

### OpenAI GPT-4
```json
{
  "id": "openai-gpt4",
  "name": "OpenAI GPT-4",
  "type": "openai",
  "config": {
    "apiBase": "https://api.openai.com/v1",
    "apiKey": "sk-...",
    "model": "gpt-4-turbo-preview",
    "temperature": 0.3,
    "maxTokens": 4000,
    "prompt": "default"
  }
}
```

### DeepSeek
```json
{
  "id": "deepseek",
  "name": "DeepSeek",
  "type": "openai",
  "config": {
    "apiBase": "https://api.deepseek.com/v1",
    "apiKey": "sk-...",
    "model": "deepseek-chat",
    "temperature": 0.3,
    "maxTokens": 4000,
    "prompt": "default"
  }
}
```

### 自定义提示词
```json
{
  "id": "custom-prompt",
  "name": "专业翻译",
  "type": "openai",
  "config": {
    "apiBase": "https://api.openai.com/v1",
    "apiKey": "sk-...",
    "model": "gpt-3.5-turbo",
    "temperature": 0.2,
    "maxTokens": 4000,
    "prompt": "你是一个专业的技术文档翻译专家。请将以下文本精确地翻译为{to}，保持专业术语的准确性。\n\n原文：\n{text}\n\n翻译："
  }
}
```

## 管理翻译器

### 编辑翻译器
1. 在管理界面点击"编辑"按钮
2. 修改配置
3. 点击"保存"

### 删除翻译器
1. 在管理界面点击"删除"按钮
2. 确认删除

### 导入/导出配置
```typescript
import { exportTranslatorsToJSON, importTranslatorsFromJSON } from "@/common/translate/custom-translators-utils";

// 导出配置
const json = exportTranslatorsToJSON();
console.log(json);

// 导入配置
importTranslatorsFromJSON(json);
```

## 注意事项

1. **API 密钥安全**: 请妥善保管你的 API 密钥，不要分享给他人
2. **费用控制**: 使用付费 API 时注意控制使用量，避免产生意外费用
3. **自动 ID 生成**: 翻译器的 ID 会根据名称或提供商类型自动生成，确保唯一性
4. **配置保存**: 所有配置会自动保存到应用配置文件中
5. **温度参数**: 对于翻译任务，建议使用较低的温度值（0.2-0.3）以获得更准确的结果

## 高级用法

### 针对不同场景使用不同配置

```typescript
// 快速翻译 - 使用 GPT-3.5，低温度
addOpenAITranslator({
  id: "fast-translate",
  name: "快速翻译",
  apiKey: "your-key",
  model: "gpt-3.5-turbo",
  temperature: 0.1,
  maxTokens: 2000,
});

// 高质量翻译 - 使用 GPT-4
addOpenAITranslator({
  id: "quality-translate",
  name: "高质量翻译",
  apiKey: "your-key",
  model: "gpt-4",
  temperature: 0.3,
  maxTokens: 4000,
});

// 创意翻译 - 较高温度
addOpenAITranslator({
  id: "creative-translate",
  name: "创意翻译",
  apiKey: "your-key",
  model: "gpt-4",
  temperature: 0.7,
  maxTokens: 4000,
});
```

### 多账号负载均衡

```typescript
// 添加多个相同类型的翻译器使用不同账号
for (let i = 1; i <= 3; i++) {
  addOpenAITranslator({
    id: `openai-account-${i}`,
    name: `OpenAI 账号 ${i}`,
    apiKey: keys[i-1],
    model: "gpt-3.5-turbo",
  });
}
```

## 故障排除

### 翻译失败
- 检查 API Base URL 是否正确
- 检查 API Key 是否有效
- 检查网络连接
- 查看控制台错误信息

### 翻译器不显示
- 确认翻译器已成功添加
- 检查 ID 是否重复
- 尝试刷新界面

### 翻译质量不佳
- 尝试调整 temperature 参数
- 使用更高级的模型
- 自定义提示词以提供更明确的指导

## 参考资料

- [OpenAI API 文档](https://platform.openai.com/docs/api-reference)
- [DeepSeek API 文档](https://platform.deepseek.com/api-docs/)
- [custom-translators-example.ts](../../src/common/translate/custom-translators-example.ts) - 更多代码示例
- [CUSTOM_TRANSLATORS_README.md](../../src/common/translate/CUSTOM_TRANSLATORS_README.md) - 技术文档
