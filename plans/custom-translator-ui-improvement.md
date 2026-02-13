# AI翻译供应商界面改进计划（原名：自定义翻译器）

## 问题分析

1. **自定义翻译器界面不够清晰**：用户可能不理解这些供应商都是基于大语言模型（LLM）的AI翻译服务
2. **阶跃星辰的混淆**：系统已内置免费的阶跃星辰翻译器（API密钥由系统配置），但用户在CustomTranslatorManager中也可以添加阶跃星辰供应商（需自备API密钥），两者容易混淆

## 改进目标

- 明确告知用户这些是基于AI/LLM的翻译服务
- 清晰区分系统内置的免费阶跃星辰和自定义阶跃星辰供应商
- 在界面中提供准确的说明

## 具体修改方案

### 1. CustomTranslatorManager.vue 组件修改

#### 1.1 添加AI翻译说明区域
在`<v-card-text>`开头添加一个信息提示框：

```vue
<v-alert
  type="info"
  dense
  text
  class="mb-4"
>
  {{ trans["aiTranslatorDescription"] || "这些翻译器基于人工智能（大语言模型/LLM），可以理解上下文并提供更自然的翻译。所有在此处添加的供应商都需要您自行配置API密钥。" }}
</v-alert>
```

#### 1.2 修改供应商模板选择器label

```vue
<v-select
  v-if="!editingProvider"
  v-model="selectedTemplate"
  :items="templateItems"
  :label="trans['selectProviderTemplate'] || '选择AI供应商类型'"
  @change="onTemplateChange"
  outlined
  dense
>
```

#### 1.3 为阶跃星辰模板添加说明标签
修改`templateItems` getter，为阶跃星辰添加特殊说明：

```typescript
get templateItems() {
  return providerTemplates.map(t => {
    const item = {
      text: t.name,
      value: t.type,
      icon: t.icon || "mdi-cog",
      description: t.description || "",
    };
    // 为阶跃星辰添加说明
    if (t.type === 'stepfun') {
      item.text = `${t.name} (${this.trans['stepfunCustomNote'] || '需自备API密钥'})`;
    }
    return item;
  });
}
```

#### 1.4 在供应商列表项中显示说明标识
修改`<v-expansion-panel-header>`部分，为阶跃星辰添加说明徽章：

```vue
<v-expansion-panel-header>
  <div class="d-flex align-center flex-grow-1">
    <v-icon class="mr-2">{{ getProviderIcon(provider.providerType) }}</v-icon>
    <div class="flex-grow-1">
      <div class="font-weight-medium">
        {{ provider.name }}
        <v-chip
          v-if="provider.providerType === 'stepfun'"
          color="warning"
          x-small
          class="ml-2"
        >
          {{ trans["stepfunCustomNote"] || "需自备API密钥" }}
        </v-chip>
      </div>
      <div class="caption grey--text">
        {{ provider.apiBase }} | {{ provider.enabledModels.length }} {{ trans["modelsEnabled"] || "个模型已启用" }}
      </div>
    </div>
  </div>
</v-expansion-panel-header>
```

### 2. Locale文件更新

需要为所有语言文件（en.json, zh-CN.json, zh-TW.json, ru.json）添加/更新以下翻译键：

#### 新增翻译键：

```json
{
  "aiTranslatorDescription": "这些翻译器基于人工智能（大语言模型/LLM），可以理解上下文并提供更自然的翻译。所有在此处添加的供应商都需要您自行配置API密钥。",
  "stepfunCustomNote": "需自备API密钥",
  "stepfunBuiltinNote": "系统已内置免费版本（设置→翻译器→阶跃星辰）"
}
```

#### 修改现有翻译键：

- `selectProviderTemplate`: 从"选择供应商模板"改为"选择供应商类型"

### 3. provider-templates.ts 更新

为阶跃星辰模板添加更明确的描述：

```typescript
{
  type: "stepfun",
  name: "阶跃星辰(StepFun)",
  apiBase: "https://api.stepfun.com/v1",
  recommendedModels: [
    "step-3.5-flash",
  ],
  icon: "mdi-robot",
  docUrl: "https://platform.stepfun.com/docs/zh/overview/concept",
  description: "阶跃星辰开放平台 - 注意：系统已内置免费版本，此处添加需自备API密钥",
},
```

### 4. 可选：在Settings.vue中添加说明

在"自定义翻译器"标签页的tab上添加tooltip，说明系统内置的免费阶跃星辰位置：

```vue
<v-tab href="#customTranslators" :title="trans['customTranslatorsTip']">
  {{ trans["customTranslators"] }}
</v-tab>
```

对应的翻译键：
```json
{
  "customTranslatorsTip": "自定义AI翻译供应商（系统已内置免费阶跃星辰：设置→翻译器→阶跃星辰）"
}
```

## 实施步骤

1. 更新 `src/components/CustomTranslatorManager.vue` 组件
2. 更新 `src/common/translate/provider-templates.ts` 中的阶跃星辰描述
3. 更新所有locale文件（en.json, zh-CN.json, zh-TW.json, ru.json）
4. 可选：更新 `src/views/Settings.vue` 添加tooltip
5. 运行 `npm run prebuild` 重新生成locale文件
6. 测试界面显示效果

## 预期效果

- 用户一进入自定义翻译器管理界面就能明白这是基于AI的翻译服务
- 清晰表明在此处添加的供应商都需要自己配置API密钥
- 阶跃星辰在选择模板和已添加列表中都有醒目的"需自备API密钥"标识
- 避免用户误以为在此处添加阶跃星辰是免费的

## 注意事项

- 所有文本都需要国际化，使用翻译键
- 保持与现有代码风格一致
- 确保所有语言文件的翻译键同步更新
- 重点区分：系统内置的免费阶跃星辰 vs 用户自定义的阶跃星辰供应商