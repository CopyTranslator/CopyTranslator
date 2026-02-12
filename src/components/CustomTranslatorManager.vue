<template>
  <div class="custom-translator-manager">
    <v-card flat>
      <v-card-title class="pb-2">
        {{ trans["customTranslators"] }}
        <v-spacer></v-spacer>
        <v-btn color="primary" small @click="showAddDialog = true">
          <v-icon small left>mdi-plus</v-icon>
          {{ trans["addTranslator"] }}
        </v-btn>
      </v-card-title>

      <v-card-text>
        <v-list v-if="translators.length > 0">
          <v-list-item
            v-for="translator in translators"
            :key="translator.id"
            two-line
          >
            <v-list-item-content>
              <v-list-item-title>{{ translator.name }}</v-list-item-title>
              <v-list-item-subtitle>
                {{ translator.config.model }}
              </v-list-item-subtitle>
            </v-list-item-content>

            <v-list-item-action>
              <div class="d-flex">
                <v-btn icon small @click="editTranslator(translator)" class="mr-1">
                  <v-icon small>mdi-pencil</v-icon>
                </v-btn>
                <v-btn icon small @click="testTranslator(translator)" class="mr-1">
                  <v-icon small>mdi-test-tube</v-icon>
                </v-btn>
                <v-btn icon small @click="removeTranslatorConfirm(translator.id)">
                  <v-icon small>mdi-delete</v-icon>
                </v-btn>
              </div>
            </v-list-item-action>
          </v-list-item>
        </v-list>

        <div v-else class="text-center pa-4 grey--text">
          {{ trans["noCustomTranslators"] }}
        </div>
      </v-card-text>
    </v-card>

    <!-- 添加/编辑对话框 -->
    <v-dialog v-model="showAddDialog" max-width="600px" persistent>
      <v-card>
        <v-card-title>
          {{ editingTranslator ? trans["editTranslator"] : trans["addTranslator"] }}
        </v-card-title>

        <v-card-text>
          <v-form ref="form" v-model="formValid">
            <!-- 快速选择提供商 -->
            <v-select
              v-model="selectedProvider"
              :items="providerItems"
              :label="trans['selectProvider']"
              @change="onProviderChange"
              outlined
              dense
            ></v-select>

            <!-- 基本配置 -->
            <v-text-field
              v-model="formData.name"
              :label="trans['translatorName']"
              :rules="[rules.required]"
              hint="ID 将根据名称自动生成"
              outlined
              dense
            ></v-text-field>

            <!-- API 配置 -->
            <v-text-field
              v-model="formData.config.apiBase"
              :label="trans['apiBase']"
              :rules="[rules.required]"
              outlined
              dense
            ></v-text-field>

            <v-text-field
              v-model="formData.config.apiKey"
              :label="trans['apiKey']"
              :rules="[rules.required]"
              type="password"
              outlined
              dense
            ></v-text-field>

            <v-row dense>
              <v-col cols="10">
                <v-combobox
                  v-model="formData.config.model"
                  :items="availableModels"
                  :label="trans['model']"
                  :rules="[rules.required]"
                  :loading="fetchingModels"
                  outlined
                  dense
                ></v-combobox>
              </v-col>
              <v-col cols="2" class="d-flex align-center">
                <v-btn
                  icon
                  :loading="fetchingModels"
                  :disabled="!canFetchModels"
                  @click="fetchAvailableModels"
                  :title="trans['fetchModels'] || '获取模型列表'"
                >
                  <v-icon>mdi-refresh</v-icon>
                </v-btn>
              </v-col>
            </v-row>
            <div v-if="modelFetchError" class="error--text caption mb-2">
              {{ modelFetchError }}
            </div>

            <!-- 高级配置 -->
            <v-expansion-panels flat>
              <v-expansion-panel>
                <v-expansion-panel-header>
                  {{ trans["advancedConfig"] }}
                </v-expansion-panel-header>
                <v-expansion-panel-content>
                  <div class="mt-2">
                    <label class="caption">{{ trans["temperature"] }}: {{ formData.config.temperature }}</label>
                    <v-slider
                      v-model="formData.config.temperature"
                      min="0"
                      max="1"
                      step="0.1"
                      thumb-label
                      dense
                    ></v-slider>
                    <p class="caption grey--text">{{ temperatureDesc }}</p>
                  </div>

                  <v-text-field
                    v-model.number="formData.config.maxTokens"
                    :label="trans['maxTokens']"
                    type="number"
                    outlined
                    dense
                  ></v-text-field>

                  <v-textarea
                    v-model="formData.config.prompt"
                    :label="trans['customPrompt']"
                    :placeholder="trans['promptPlaceholder']"
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
          <v-btn text @click="closeDialog">{{ trans["cancel"] }}</v-btn>
          <v-btn
            color="primary"
            :disabled="!formValid"
            @click="saveTranslator"
          >
            {{ trans["ok"] }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- 测试对话框 -->
    <v-dialog v-model="showTestDialog" max-width="500px">
      <v-card>
        <v-card-title>{{ trans["testTranslator"] }}</v-card-title>
        <v-card-text>
          <v-textarea
            v-model="testText"
            :label="trans['testText']"
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
            {{ trans["testTranslator"] }}
          </v-btn>
          <div v-if="testResult" class="mt-3">
            <v-alert type="success" dense>
              <div><strong>{{ trans["testResult"] }}:</strong></div>
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
          <v-btn text @click="showTestDialog = false">{{ trans["cancel"] }}</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import {
  customTranslatorManager,
  CustomTranslatorConfig,
} from "@/common/translate/custom-translators";
import { getTranslator } from "@/common/translate/translators";
import { fetchModels } from "@/common/translate/model-fetcher";

@Component
export default class CustomTranslatorManager extends Vue {
  translators: CustomTranslatorConfig[] = [];
  showAddDialog = false;
  showTestDialog = false;
  formValid = false;
  editingTranslator: CustomTranslatorConfig | null = null;
  selectedProvider = "";
  testing = false;
  testText = "Hello, world!";
  testFrom = "en";
  testTo = "zh-CN";
  testResult = "";
  testError = "";
  testingTranslatorId = "";
  fetchingModels = false;
  fetchedModels: string[] = [];
  modelFetchError = "";

  testLanguages = ["en", "zh-CN", "zh-TW", "ja", "ko", "fr", "es", "de", "ru"];

  get trans() {
    return this.$store.getters.locale;
  }

  get providerItems() {
    return [
      { text: this.trans["providerOpenAI"] || "OpenAI", value: "openai" },
      { text: this.trans["providerAzure"] || "Azure OpenAI", value: "azure" },
      { text: this.trans["providerDeepSeek"] || "DeepSeek", value: "deepseek" },
      { text: this.trans["providerMoonshot"] || "Moonshot", value: "moonshot" },
      { text: this.trans["providerZhipu"] || "Zhipu AI", value: "zhipu" },
      { text: this.trans["providerDashScope"] || "Alibaba DashScope", value: "dashscope" },
      { text: this.trans["providerCustom"] || "Custom", value: "custom" },
    ];
  }

  formData: CustomTranslatorConfig = {
    id: "",
    name: "",
    type: "openai",
    config: {
      apiBase: "https://api.openai.com/v1",
      apiKey: "",
      model: "gpt-3.5-turbo",
      temperature: 0.3,
      maxTokens: 4000,
      prompt: "default",
    },
  };

  get rules() {
    return {
      required: (v: string) => !!v || (this.trans["idRequired"] || "Required"),
    };
  }

  get recommendedModels(): string[] {
    return [];
  }

  get availableModels(): string[] {
    // 如果有获取到的模型，优先使用，否则使用推荐模型
    return this.fetchedModels.length > 0 ? this.fetchedModels : this.recommendedModels;
  }

  get canFetchModels(): boolean {
    // 需要有 API Base 和 API Key 才能获取模型
    return !!this.formData.config.apiBase && !!this.formData.config.apiKey;
  }

  get temperatureDesc(): string {
    const temp = this.formData.config.temperature || 0.3;
    if (temp < 0.2) return this.trans["temperatureDesc0"] || "";
    if (temp < 0.5) return this.trans["temperatureDesc1"] || "";
    if (temp < 0.8) return this.trans["temperatureDesc2"] || "";
    return this.trans["temperatureDesc3"] || "";
  }

  mounted() {
    this.loadTranslators();
  }

  loadTranslators() {
    this.translators = customTranslatorManager.getAllConfigs();
  }

  onProviderChange(provider: string) {
    const presets: Record<string, any> = {
      openai: {
        apiBase: "https://api.openai.com/v1",
        model: "gpt-3.5-turbo",
      },
      deepseek: {
        apiBase: "https://api.deepseek.com/v1",
        model: "deepseek-chat",
      },
      moonshot: {
        apiBase: "https://api.moonshot.cn/v1",
        model: "moonshot-v1-8k",
      },
      zhipu: {
        apiBase: "https://open.bigmodel.cn/api/paas/v4",
        model: "glm-4",
      },
      dashscope: {
        apiBase: "https://dashscope.aliyuncs.com/compatible-mode/v1",
        model: "qwen-plus",
      },
    };

    const preset = presets[provider];
    if (preset) {
      this.formData.config.apiBase = preset.apiBase;
      this.formData.config.model = preset.model;
    }
    
    // 清空已获取的模型列表
    this.fetchedModels = [];
    this.modelFetchError = "";
  }

  async fetchAvailableModels() {
    if (!this.canFetchModels) {
      return;
    }

    this.fetchingModels = true;
    this.modelFetchError = "";

    try {
      const models = await fetchModels(
        this.formData.config.apiBase,
        this.formData.config.apiKey
      );
      
      if (models.length === 0) {
        this.modelFetchError = this.trans["noModelsFound"] || "未找到任何模型";
        this.fetchedModels = [];
      } else {
        this.fetchedModels = models;
        console.log(`获取到 ${models.length} 个模型:`, models);
        
        // 如果当前没有选择模型，自动选择第一个
        if (!this.formData.config.model && models.length > 0) {
          this.formData.config.model = models[0];
        }
      }
    } catch (error: any) {
      this.modelFetchError = error.message || "获取模型列表失败";
      console.error("获取模型失败:", error);
    } finally {
      this.fetchingModels = false;
    }
  }

  editTranslator(translator: CustomTranslatorConfig) {
    this.editingTranslator = translator;
    this.formData = JSON.parse(JSON.stringify(translator));
    this.selectedProvider = "";
    this.showAddDialog = true;
  }

  removeTranslatorConfirm(id: string) {
    if (confirm(`${this.trans["confirmDelete"]} "${id}"?`)) {
      customTranslatorManager.removeTranslator(id);
      this.loadTranslators();
    }
  }

  saveTranslator() {
    // 确保 prompt 字段存在
    if (!this.formData.config.prompt) {
      this.formData.config.prompt = "default";
    }

    if (this.editingTranslator) {
      customTranslatorManager.updateTranslator(
        this.editingTranslator.id,
        this.formData
      );
    } else {
      // 添加新翻译器时自动生成 ID
      // 基于提供商类型生成基础 ID
      let baseId = this.selectedProvider || "custom";
      
      // 如果有名称，尝试使用名称的拼音或简化版本
      if (this.formData.name) {
        // 移除特殊字符，转换为小写，用连字符分隔
        const simpleName = this.formData.name
          .toLowerCase()
          .replace(/\s+/g, "-")
          .replace(/[^a-z0-9\u4e00-\u9fa5-]/g, "");
        if (simpleName) {
          baseId = simpleName;
        }
      }
      
      // 生成唯一 ID
      this.formData.id = customTranslatorManager.generateUniqueId(baseId);
      customTranslatorManager.addTranslator(this.formData);
    }
    this.loadTranslators();
    this.closeDialog();
  }

  closeDialog() {
    this.showAddDialog = false;
    this.editingTranslator = null;
    this.resetForm();
  }

  resetForm() {
    this.formData = {
      id: "",
      name: "",
      type: "openai",
      config: {
        apiBase: "https://api.openai.com/v1",
        apiKey: "",
        model: "gpt-3.5-turbo",
        temperature: 0.3,
        maxTokens: 4000,
        prompt: "default",
      },
    };
    this.selectedProvider = "";
    this.fetchedModels = [];
    this.modelFetchError = "";
  }

  testTranslator(translator: CustomTranslatorConfig) {
    this.testingTranslatorId = translator.id;
    this.showTestDialog = true;
    this.testResult = "";
    this.testError = "";
    this.testing = false;
  }

  async runTest() {
    this.testing = true;
    this.testResult = "";
    this.testError = "";

    try {
      const translator = getTranslator(this.testingTranslatorId);
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
