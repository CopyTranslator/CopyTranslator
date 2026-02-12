# 自定义翻译器快速开始

## 现在可以使用了！✅

经过系统优化，自定义翻译器现在已经完全集成到 CopyTranslator 中。

## 5 分钟快速上手

### 第 1 步：打开管理界面

在设置中找到"自定义翻译器管理"

### 第 2 步：添加翻译器

1. 点击"添加翻译器"按钮
2. 选择提供商（例如：OpenAI、DeepSeek）
3. 填写必要信息：
   - **名称**：例如 "我的 GPT-4"（ID 会自动生成）
   - **API Key**：你的 API 密钥
   - **API Base**：自动填写（或手动修改）
4. **自动获取模型**（新功能！🆕）：
   - 点击模型输入框旁的 🔄 刷新按钮
   - 等待 2-3 秒，系统会自动获取可用模型列表
   - 从下拉列表中选择模型
   - 或者手动输入模型名称

### 第 3 步：开始使用

添加成功后：
- ✅ 自定义翻译器会**自动出现**在主界面的引擎按钮中
- ✅ 点击引擎按钮即可切换使用
- ✅ 悬停查看翻译器名称

## 实际案例

### 案例 1：添加 DeepSeek

```
名称: DeepSeek 智能翻译
API Base: https://api.deepseek.com/v1
API Key: sk-your-key-here
模型: deepseek-chat
```

### 案例 2：添加 OpenAI GPT-4

```
名称: GPT-4 高质量翻译
API Base: https://api.openai.com/v1
API Key: sk-your-key-here
模型: gpt-4-turbo-preview
```

### 案例 3：添加 Moonshot

```
名称: 月之暗面
API Base: https://api.moonshot.cn/v1
API Key: your-key-here
模型: moonshot-v1-8k
```

## 高级设置（可选）

### Temperature（温度）
- **0.1-0.2**：最准确，适合技术文档
- **0.3**（推荐）：平衡准确性和流畅性
- **0.5-0.8**：更有创造性

### 自定义提示词

如果你想让翻译更专业，可以自定义提示词：

```
你是一个专业的{to}翻译专家。
请将以下内容准确翻译为{to}，保持原文的语气和风格。

原文：
{text}

翻译：
```

## 常见问题

### Q: 添加后看不到按钮？
A: 确保点击了"保存"。如果还是看不到，尝试重启应用。

### Q: 翻译失败？
A: 
1. 检查 API Key 是否正确
2. 检查 API Base URL 是否正确
3. 点击"测试"按钮验证配置

### Q: 如何删除翻译器？
A: 在管理界面点击对应翻译器的"删除"按钮

### Q: 可以添加多个相同服务商的翻译器吗？
A: 可以！例如可以添加多个 OpenAI 翻译器，使用不同的模型或参数。

## 支持的服务

所有兼容 OpenAI API 格式的服务都支持：

✅ OpenAI (GPT-4, GPT-3.5)  
✅ DeepSeek  
✅ Moonshot (月之暗面)  
✅ 智谱 AI (GLM-4)  
✅ 阿里云通义千问  
✅ Azure OpenAI  
✅ 其他兼容服务  

## 技术特点

- ✨ **智能 ID 生成**：无需手动输入 ID，避免冲突
- 🔄 **自动获取模型**：点击刷新按钮，自动获取可用模型列表
- 🔄 **实时切换**：添加后立即可用
- 💾 **自动保存**：配置自动持久化
- 🎯 **独立缓存**：每个翻译器独立缓存结果
- 🌐 **完整支持**：支持所有翻译功能（多源对比、语言检测等）

## 下一步

- 查看 [自动获取模型列表功能](auto-fetch-models.md) 🆕
- 查看 [完整使用指南](custom-translators-usage.md)
- 查看 [代码示例](../../src/common/translate/custom-translators-example.ts)
- 查看 [技术文档](../../src/common/translate/CUSTOM_TRANSLATORS_README.md)

---

**提示**：首次使用建议先用"测试"功能验证配置是否正确！
