<template>
  <div class="custom-translator-manager">
    <v-card flat>
      <v-card-title class="pb-2">
        {{ trans["aiProviders"] || "AI翻译供应商" }}
        <v-spacer></v-spacer>
        <v-btn color="primary" small @click="showAddProviderDialog = true">
          <v-icon small left>mdi-plus</v-icon>
          {{ trans["addAIProvider"] || "添加AI供应商" }}
        </v-btn>
      </v-card-title>

      <v-card-text>
        <!-- AI翻译说明 -->
        <v-alert
          type="info"
          dense
          text
          class="mb-4"
        >
          {{ trans["aiTranslatorDescription"] || "这些翻译器基于人工智能（大语言模型/LLM），可以理解上下文并提供更自然的翻译。所有在此处添加的供应商都需要您自行配置API密钥。" }}
        </v-alert>
        <!-- 供应商列表 -->
        <v-expansion-panels v-if="providers.length > 0" multiple>
          <v-expansion-panel
            v-for="provider in providers"
            :key="provider.id"
          >
            <!-- 供应商头部 -->
            <v-expansion-panel-header>
              <div class="d-flex align-center flex-grow-1">
                <div :class="['provider-icon', 'mr-2', `provider-${provider.providerType}`]"></div>
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

            <!-- 供应商内容 -->
            <v-expansion-panel-content>
              <v-card flat>
                <!-- 供应商操作按钮 -->
                <v-card-actions class="px-0 py-2">
                  <v-btn small text color="primary" @click="editProvider(provider)">
                    <v-icon small left>mdi-pencil</v-icon>
                    {{ trans["edit"] || "编辑" }}
                  </v-btn>
                  <v-btn small text color="error" @click="removeProviderConfirm(provider.id)">
                    <v-icon small left>mdi-delete</v-icon>
                    {{ trans["delete"] || "删除" }}
                  </v-btn>
                  <v-spacer></v-spacer>
                  <v-btn small text @click="testProvider(provider)">
                    <v-icon small left>mdi-test-tube</v-icon>
                    {{ trans["test"] || "测试" }}
                  </v-btn>
                </v-card-actions>

                <v-divider></v-divider>

                <!-- 模型选择区域 -->
                <v-card-text class="px-0">
                  <div class="d-flex align-center mb-2">
                    <span class="subtitle-2">{{ trans["selectModels"] || "选择要启用的模型" }}</span>
                    <v-spacer></v-spacer>
                    <v-btn
                      x-small
                      text
                      :loading="provider.fetchingModels"
                      @click="fetchProviderModels(provider)"
                    >
                      <v-icon small left>mdi-refresh</v-icon>
                      {{ trans["refreshModels"] || "刷新" }}
                    </v-btn>
                  </div>

                  <!-- 模型列表 -->
                  <div v-if="provider.availableModels && provider.availableModels.length > 0">
                    <v-chip-group
                      :value="provider.enabledModels"
                      @change="(models) => updateProviderModels(provider.id, models)"
                      multiple
                      column
                    >
                      <v-chip
                        v-for="model in provider.availableModels"
                        :key="model"
                        :value="model"
                        filter
                        outlined
                        small
                      >
                        {{ model }}
                      </v-chip>
                    </v-chip-group>
                  </div>

                  <!-- 无可用模型提示 -->
                  <v-alert
                    v-else-if="!provider.fetchingModels"
                    dense
                    text
                    type="info"
                    class="mt-2"
                  >
                    {{ trans["noModelsHint"] || "点击刷新按钮获取可用模型列表" }}
                  </v-alert>

                  <!-- 模型获取错误 -->
                  <v-alert
                    v-if="provider.modelFetchError"
                    dense
                    text
                    type="error"
                    class="mt-2"
                    dismissible
                    @input="provider.modelFetchError = ''"
                  >
                    {{ provider.modelFetchError }}
                  </v-alert>
                </v-card-text>
              </v-card>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>

        <!-- 无供应商提示 -->
        <div v-else class="text-center pa-4 grey--text">
          {{ trans["noAIProviders"] || "暂无AI供应商" }}
        </div>
      </v-card-text>
    </v-card>

    <!-- 添加/编辑供应商对话框 -->
    <v-dialog v-model="showAddProviderDialog" max-width="600px" persistent>
      <v-card>
        <v-card-title>
          {{ editingProvider ? (trans["editAIProvider"] || "编辑AI供应商") : (trans["addAIProvider"] || "添加AI供应商") }}
        </v-card-title>

        <v-card-text>
          <v-form ref="form" v-model="formValid">
            <!-- 快速选择供应商模板 -->
            <v-select
              v-if="!editingProvider"
              v-model="selectedTemplate"
              :items="templateItems"
              :label="trans['selectProviderTemplate'] || '选择AI供应商类型'"
              @change="onTemplateChange"
              outlined
              dense
            >
              <template v-slot:item="{ item }">
                <div :class="['provider-icon', 'mr-2', `provider-${item.value}`]"></div>
                <div>
                  <div>{{ item.text }}</div>
                  <div class="caption grey--text">{{ item.description }}</div>
                </div>
              </template>
            </v-select>

            <!-- 供应商名称 -->
            <v-text-field
              v-model="providerForm.name"
              :label="trans['providerName'] || '供应商名称'"
              :rules="[rules.required]"
              hint="例如: OpenAI 官方账号"
              outlined
              dense
            ></v-text-field>

            <!-- API Base URL -->
            <v-text-field
              v-model="providerForm.apiBase"
              :label="trans['apiBase'] || 'API Base URL'"
              :rules="[rules.required]"
              outlined
              dense
            ></v-text-field>

            <!-- API Key -->
            <v-text-field
              v-model="providerForm.apiKey"
              :label="trans['apiKey'] || 'API Key'"
              :rules="[rules.required]"
              type="password"
              outlined
              dense
            ></v-text-field>

            <!-- 高级配置 -->
            <v-expansion-panels flat>
              <v-expansion-panel>
                <v-expansion-panel-header>
                  {{ trans["advancedConfig"] || "高级配置" }}
                </v-expansion-panel-header>
                <v-expansion-panel-content>
                  <div class="mt-2">
                    <label class="caption">
                      {{ trans["temperature"] || "温度" }}: {{ providerForm.config.temperature }}
                    </label>
                    <v-slider
                      v-model="providerForm.config.temperature"
                      min="0"
                      max="1"
                      step="0.1"
                      thumb-label
                      dense
                    ></v-slider>
                    <p class="caption grey--text">{{ temperatureDesc }}</p>
                  </div>

                  <v-text-field
                    v-model.number="providerForm.config.maxTokens"
                    :label="trans['maxTokens'] || '最大Token数'"
                    type="number"
                    outlined
                    dense
                  ></v-text-field>

                  <v-textarea
                    v-model="providerForm.config.prompt"
                    :label="trans['customPrompt'] || '自定义提示词'"
                    :placeholder="trans['promptPlaceholder'] || '留空使用默认提示词'"
                    rows="4"
                    outlined
                    dense
                  ></v-textarea>
                </v-expansion-panel-content>
              </v-expansion-panel>
            </v-expansion-panels>
          </v-form>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text @click="closeProviderDialog">{{ trans["cancel"] || "取消" }}</v-btn>
          <v-btn
            color="primary"
            :disabled="!formValid"
            @click="saveProvider"
          >
            {{ trans["ok"] || "确定" }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- 测试对话框 -->
    <v-dialog v-model="showTestDialog" max-width="500px">
      <v-card>
        <v-card-title>{{ trans["testAIProvider"] || "测试AI供应商" }}</v-card-title>
        <v-card-text>
          <v-select
            v-model="testModel"
            :items="testingProvider ? testingProvider.enabledModels : []"
            :label="trans['selectModel'] || '选择模型'"
            outlined
            dense
          ></v-select>

          <v-textarea
            v-model="testText"
            :label="trans['testText'] || '测试文本'"
            rows="2"
            outlined
            dense
          ></v-textarea>

          <v-row dense>
            <v-col cols="6">
              <v-select
                v-model="testFrom"
                :items="testLanguages"
                label="From"
                outlined
                dense
              ></v-select>
            </v-col>
            <v-col cols="6">
              <v-select
                v-model="testTo"
                :items="testLanguages"
                label="To"
                outlined
                dense
              ></v-select>
            </v-col>
          </v-row>

          <v-btn color="primary" @click="runTest" :loading="testing" block>
            {{ trans["test"] || "测试" }}
          </v-btn>

          <div v-if="testResult" class="mt-3">
            <v-alert type="success" dense>
              <div><strong>{{ trans["testResult"] || "测试结果" }}:</strong></div>
              <div>{{ testResult }}</div>
            </v-alert>
          </div>

          <div v-if="testError" class="mt-3">
            <v-alert type="error" dense>
              {{ testError }}
            </v-alert>
          </div>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text @click="showTestDialog = false">{{ trans["cancel"] || "取消" }}</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { customTranslatorManager } from "@/common/translate/custom-translators";
import { getTranslator } from "@/common/translate/translators";
import { fetchModels } from "@/common/translate/model-fetcher";
import { ProviderConfig } from "@/common/translate/types";
import { providerTemplates, getProviderTemplate } from "@/common/translate/provider-templates";

interface ProviderWithUI extends ProviderConfig {
  availableModels?: string[];
  fetchingModels?: boolean;
  modelFetchError?: string;
}

@Component
export default class CustomTranslatorManagerView extends Vue {
  providers: ProviderWithUI[] = [];
  showAddProviderDialog = false;
  showTestDialog = false;
  formValid = false;
  editingProvider: ProviderConfig | null = null;
  selectedTemplate = "";
  
  // 测试相关
  testing = false;
  testText = "Hello, world!";
  testFrom = "en";
  testTo = "zh-CN";
  testResult = "";
  testError = "";
  testingProvider: ProviderWithUI | null = null;
  testModel = "";

  testLanguages = ["en", "zh-CN", "zh-TW", "ja", "ko", "fr", "es", "de", "ru"];

  // 供应商表单
  providerForm: ProviderConfig = {
    id: "",
    name: "",
    providerType: "custom",
    apiBase: "https://",
    apiKey: "",
    enabledModels: [],
    config: {
      temperature: 0.3,
      maxTokens: 4000,
      prompt: "",
    },
    enabled: true,
  };

  get trans() {
    return this.$store.getters.locale;
  }

  get templateItems() {
   return providerTemplates.map(t => {
     const item = {
       text: t.name,
       value: t.type,
       description: t.description || "",
     };
     // 为阶跃星辰添加说明
     if (t.type === 'stepfun') {
       item.text = `${t.name} (${this.trans['stepfunCustomNote'] || '需自备API密钥'})`;
     }
     return item;
   });
 }

  get rules() {
    return {
      required: (v: string) => !!v || (this.trans["required"] || "此项必填"),
    };
  }

  get temperatureDesc(): string {
    const temp = this.providerForm.config?.temperature || 0.3;
    if (temp < 0.2) return this.trans["temperatureDesc0"] || "更精确，更确定";
    if (temp < 0.5) return this.trans["temperatureDesc1"] || "平衡";
    if (temp < 0.8) return this.trans["temperatureDesc2"] || "更有创意";
    return this.trans["temperatureDesc3"] || "非常有创意，可能不稳定";
  }

  mounted() {
    this.loadProviders();
  }

  loadProviders() {
    const baseProviders = customTranslatorManager.getAllProviders();
    this.providers = baseProviders.map(p => ({
      ...p,
      availableModels: p.enabledModels.length > 0 ? [...p.enabledModels] : undefined,
      fetchingModels: false,
      modelFetchError: "",
    }));
  }

  onTemplateChange(templateType: string) {
    const template = getProviderTemplate(templateType);
    if (template) {
      this.providerForm.providerType = template.type;
      this.providerForm.apiBase = template.apiBase;
      this.providerForm.name = template.name;
      
      // 清空已获取的模型
      this.providerForm.enabledModels = [];
    }
  }

  async fetchProviderModels(provider: ProviderWithUI) {
    if (!provider.apiBase || !provider.apiKey) {
      provider.modelFetchError = this.trans["apiConfigRequired"] || "请先配置 API Base 和 API Key";
      return;
    }

    provider.fetchingModels = true;
    provider.modelFetchError = "";

    try {
      const models = await fetchModels(provider.apiBase, provider.apiKey);
      
      if (models.length === 0) {
        // 使用推荐模型作为后备
        const template = getProviderTemplate(provider.providerType);
        if (template && template.recommendedModels.length > 0) {
          provider.availableModels = template.recommendedModels;
          provider.modelFetchError = this.trans["usingRecommendedModels"] || "API 未返回模型列表，使用推荐模型";
        } else {
          provider.modelFetchError = this.trans["noModelsFound"] || "未找到任何模型";
          provider.availableModels = [];
        }
      } else {
        provider.availableModels = models;
        console.log(`获取到 ${models.length} 个模型:`, models);
      }
    } catch (error: any) {
      provider.modelFetchError = error.message || "获取模型列表失败";
      console.error("获取模型失败:", error);
      
      // 失败时尝试使用推荐模型
      const template = getProviderTemplate(provider.providerType);
      if (template && template.recommendedModels.length > 0) {
        provider.availableModels = template.recommendedModels;
      }
    } finally {
      provider.fetchingModels = false;
    }
  }

  updateProviderModels(providerId: string, models: string[]) {
    customTranslatorManager.setEnabledModels(providerId, models);
    this.loadProviders();
  }

  editProvider(provider: ProviderConfig) {
    this.editingProvider = provider;
    this.providerForm = JSON.parse(JSON.stringify(provider));
    this.selectedTemplate = "";
    this.showAddProviderDialog = true;
  }

  removeProviderConfirm(id: string) {
    const provider = this.providers.find(p => p.id === id);
    const name = provider?.name || id;
    if (confirm(`${this.trans["confirmDelete"] || "确认删除"} "${name}"?`)) {
      customTranslatorManager.removeProvider(id);
      this.loadProviders();
    }
  }

  saveProvider() {
    // 确保有必要字段
    if (!this.providerForm.config) {
      this.providerForm.config = {
        temperature: 0.3,
        maxTokens: 4000,
        prompt: "",
      };
    }

    if (this.editingProvider) {
      // 更新现有供应商
      customTranslatorManager.updateProvider(
        this.editingProvider.id,
        this.providerForm
      );
    } else {
      // 添加新供应商时自动生成 ID
      let baseId = this.providerForm.providerType || "custom";
      
      // 如果有名称，尝试使用名称的简化版本
      if (this.providerForm.name) {
        const simpleName = this.providerForm.name
          .toLowerCase()
          .replace(/\s+/g, "-")
          .replace(/[^a-z0-9\u4e00-\u9fa5-]/g, "");
        if (simpleName) {
          baseId = simpleName;
        }
      }
      
      // 生成唯一 ID
      this.providerForm.id = customTranslatorManager.generateUniqueProviderId(baseId);
      customTranslatorManager.addProvider(this.providerForm);
    }
    
    this.loadProviders();
    this.closeProviderDialog();
  }

  closeProviderDialog() {
    this.showAddProviderDialog = false;
    this.editingProvider = null;
    this.resetProviderForm();
  }

  resetProviderForm() {
    this.providerForm = {
      id: "",
      name: "",
      providerType: "custom",
      apiBase: "https://",
      apiKey: "",
      enabledModels: [],
      config: {
        temperature: 0.3,
        maxTokens: 4000,
        prompt: "",
      },
      enabled: true,
    };
    this.selectedTemplate = "";
  }

  testProvider(provider: ProviderWithUI) {
    if (provider.enabledModels.length === 0) {
      alert(this.trans["noModelsEnabled"] || "请先启用至少一个模型");
      return;
    }
    
    this.testingProvider = provider;
    this.testModel = provider.enabledModels[0];
    this.showTestDialog = true;
    this.testResult = "";
    this.testError = "";
    this.testing = false;
  }

  async runTest() {
    if (!this.testingProvider || !this.testModel) {
      return;
    }

    this.testing = true;
    this.testResult = "";
    this.testError = "";

    try {
      const translatorId = customTranslatorManager.getTranslatorIdForModel(
        this.testingProvider.id,
        this.testModel
      );
      
      const translator = getTranslator(translatorId);
      const result = await translator.translate(
        this.testText,
        this.testFrom as any,
        this.testTo as any
      );
      this.testResult = result.trans.paragraphs.join("\n");
    } catch (error) {
      this.testError = String(error);
    } finally {
      this.testing = false;
    }
  }
}
</script>

<style scoped>
.custom-translator-manager {
  height: 100%;
  overflow: auto;
}
</style>
