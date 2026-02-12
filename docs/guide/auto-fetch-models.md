# 自动获取模型列表功能

## ✨ 新功能

现在添加自定义翻译器时，不需要手动输入模型名称了！只需填写 API Key 和 API Base，点击刷新按钮即可自动获取可用模型列表。

## 使用方法

### 1. 基本步骤

1. 打开"自定义翻译器管理"
2. 点击"添加翻译器"
3. 选择提供商（或自定义）
4. 填写 **API Base** 和 **API Key**
5. 点击模型输入框旁边的 **刷新按钮** 🔄
6. 等待几秒，模型列表会自动加载
7. 从下拉列表中选择模型
8. 保存

### 2. 详细说明

#### 刷新按钮状态

- **启用**：当 API Base 和 API Key 都填写后，刷新按钮可点击
- **禁用**：缺少 API Base 或 API Key 时，刷新按钮禁用（灰色）
- **加载中**：点击后显示加载动画

#### 模型列表来源

- **已获取**：如果成功从 API 获取，显示实际可用的模型
- **推荐列表**：如果未获取或获取失败，显示预设的推荐模型

#### 错误提示

如果获取失败，会显示具体的错误信息：

- **"API Key 无效或已过期"**：检查 API Key 是否正确
- **"没有访问权限"**：账号可能没有访问权限
- **"API 端点不存在"**：检查 API Base 是否正确
- **"无法连接到服务器"**：检查网络连接和 API Base

## 示例场景

### 场景 1：添加 OpenAI 翻译器

```
1. 选择提供商：OpenAI
2. API Base：https://api.openai.com/v1 (自动填写)
3. API Key：sk-proj-xxxxx (你的密钥)
4. 点击刷新按钮 🔄
5. 等待 2-3 秒
6. 模型列表更新：
   - gpt-4-turbo-preview
   - gpt-4
   - gpt-3.5-turbo
   - ... (更多模型)
7. 选择你需要的模型
8. 保存
```

### 场景 2：添加 DeepSeek 翻译器

```
1. 选择提供商：DeepSeek
2. API Base：https://api.deepseek.com/v1 (自动填写)
3. API Key：sk-xxxxx
4. 点击刷新 🔄
5. 模型列表：
   - deepseek-chat
   - deepseek-coder
6. 选择 deepseek-chat
7. 保存
```

### 场景 3：自定义 API 服务

```
1. 选择提供商：Custom
2. API Base：https://your-custom-api.com/v1
3. API Key：your-custom-key
4. 点击刷新 🔄
5. 获取你自己部署的模型列表
6. 选择需要的模型
7. 保存
```

## 技术细节

### API 端点

自动调用：`{API_Base}/models`

符合 OpenAI API 规范的标准端点。

### 请求示例

```http
GET https://api.openai.com/v1/models
Authorization: Bearer sk-xxxxx
Content-Type: application/json
```

### 响应格式

```json
{
  "object": "list",
  "data": [
    {
      "id": "gpt-4",
      "object": "model",
      "created": 1687882411,
      "owned_by": "openai"
    },
    {
      "id": "gpt-3.5-turbo",
      "object": "model",
      "created": 1677610602,
      "owned_by": "openai"
    }
  ]
}
```

### 超时设置

- 请求超时：10 秒
- 如果 10 秒内未响应，会显示超时错误

## 兼容性

支持所有符合 OpenAI API 规范的服务：

✅ OpenAI  
✅ DeepSeek  
✅ Moonshot  
✅ 智谱 AI  
✅ 阿里云 DashScope  
✅ Azure OpenAI  
✅ LocalAI  
✅ vLLM  
✅ Ollama (with OpenAI adapter)  
✅ 其他自定义服务  

## 故障排除

### 问题 1：点击刷新无反应

**检查**：
- API Base 和 API Key 是否都已填写
- 检查控制台是否有错误信息

### 问题 2：提示"API 端点不存在"

**原因**：API Base 不正确

**解决**：
- 确保 API Base 格式正确
- 移除末尾的斜杠（如果有）
- 示例：`https://api.openai.com/v1` ✅
- 错误：`https://api.openai.com/v1/` ❌

### 问题 3：提示"API Key 无效"

**检查**：
- API Key 是否完整（包含 `sk-` 前缀）
- API Key 是否过期
- API Key 是否有访问权限

### 问题 4：无法连接服务器

**检查**：
- 网络连接是否正常
- 是否需要代理
- API 服务是否在线

### 问题 5：获取到 0 个模型

**可能原因**：
- API 确实没有模型
- API 返回格式不标准

**解决**：
- 手动输入模型名称
- 或使用推荐的模型名称

## 后备方案

如果自动获取失败，仍然可以：

1. **手动输入模型名称**
   - 模型字段支持直接输入
   - 输入你知道的模型名称即可

2. **使用推荐列表**
   - 系统会根据提供商显示常用模型
   - 可以从推荐列表中选择

## 优势

✨ **更方便**：不需要记住模型名称  
✨ **更准确**：直接获取实际可用的模型  
✨ **实时更新**：当 API 新增模型时自动显示  
✨ **减少错误**：避免输入错误的模型名称  

## 注意事项

1. **网络要求**：需要能够访问 API 服务器
2. **API 限制**：某些 API 可能限制 `/models` 端点的访问
3. **超时处理**：如果网络慢，可能需要多等几秒
4. **安全性**：API Key 在请求时会被传输，确保使用 HTTPS

## 快捷键

暂无快捷键，需要点击刷新按钮。

## 视频演示

（待添加视频演示）

## 反馈

如果遇到问题或有建议，请提供：
1. 使用的 API 服务商
2. 错误信息截图
3. 控制台日志
