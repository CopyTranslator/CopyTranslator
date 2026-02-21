<template>
  <div style="height: 100%; display: flex; flex-direction: column;">
    <v-tabs v-model="activeTab" class="flex-grow-0">
      <v-tab>{{ trans['translatorList'] || '翻译器列表' }}</v-tab>
      <v-tab>{{ trans['translatorGroups'] || '分组设置' }}</v-tab>
    </v-tabs>

    <div style="flex: 1; overflow: hidden; position: relative;">
      <v-tabs-items v-model="activeTab" style="height: 100%; overflow: auto;">
        <v-tab-item style="min-height: 100%;">
          <div class="pa-3">
            <div class="caption grey--text mb-3">
              {{ trans["enabledCount"] || "已启用" }}: {{ enabledTranslators.length }}
              ·
              {{ trans["cachedCount"] || "已缓存" }}: {{ cacheTranslators.length }}
            </div>
            <v-alert dense text type="info" class="mb-4">
              <div class="caption" style="white-space: pre-line;">
                {{
                  trans["translatorManagerTips"] ||
                  "提示：\n1) 先在配置中填写密钥，未配置的翻译器无法启用。\n2) 批量启用只会启用已完成配置的翻译器。\n3) 缓存会加快切换引擎速度，但会占用更多资源。"
                }}
              </div>
            </v-alert>

            <!-- 翻译器列表 -->
            <div class="translator-header-row">
              <div class="translator-header-cell translator-header-enable">
                {{ trans["enableLabel"] || "启用" }}
              </div>
              <div class="translator-header-cell translator-header-name">
                {{ trans["translatorNameLabel"] || "名称" }}
              </div>
              <div class="translator-header-cell translator-header-cache">
                {{ trans["cacheShortLabel"] || "缓存" }}
              </div>
              <div class="translator-header-cell translator-header-expand">
                {{ trans["expand"] || "展开" }}
              </div>
            </div>
            <v-expansion-panels multiple flat v-model="configVisibleIndexes" class="translator-panels">
              <v-expansion-panel
                v-for="translator in translatorList"
                :key="translator.id"
                class="translator-panel"
              >
                <v-expansion-panel-header class="translator-panel-header">
                  <template v-slot:default>
                    <div class="translator-row" @click.stop>
                      <div class="translator-cell translator-enable">
                        <v-checkbox
                          v-model="translator.enabled"
                          @click.stop
                          @change="updateEnabled(translator.id, translator.enabled)"
                          :disabled="!isConfigComplete(translator.id) || (translator.id === 'google' && enabledTranslators.length <= 1)"
                          :title="getCheckboxTitle(translator.id)"
                          hide-details
                          class="translator-checkbox"
                        ></v-checkbox>
                      </div>
                      <div
                        class="translator-cell translator-name"
                        :title="translator.name"
                      >
                        {{ translator.name }}
                      </div>
                      <div class="translator-cell translator-cache">
                        <v-checkbox
                          v-model="translator.cache"
                          @click.stop
                          @change="updateCache(translator.id, translator.cache)"
                          :disabled="!translator.enabled"
                          :title="
                            trans['<tooltip>translator-cache'] ||
                            '缓存会自动查询并加速切换翻译器'
                          "
                          hide-details
                          class="translator-checkbox"
                        ></v-checkbox>
                      </div>
                    </div>
                  </template>
                </v-expansion-panel-header>
                <v-expansion-panel-content>
                  <v-card flat class="pa-3" style="background: #fafafa; border-radius: 4px;">
                    <KeyConfig :identifier="translator.id"></KeyConfig>
                  </v-card>
                </v-expansion-panel-content>
              </v-expansion-panel>
            </v-expansion-panels>

            <!-- 后备翻译器设置 -->
            <v-card flat class="mt-4">
              <v-card-title class="subtitle-2 py-2">
                {{ trans["fallbackTranslator"] || "后备翻译器" }}
              </v-card-title>
              <v-card-text class="pt-0 pb-2">
                <v-select
                  v-model="fallbackTranslator"
                  :items="enabledTranslators"
                  :label="trans['selectFallbackTranslator'] || '选择后备翻译器'"
                  outlined
                  dense
                  :hint="trans['<tooltip>fallbackTranslator'] || '当前翻译器不支持目标语言时自动使用'"
                  persistent-hint
                  class="caption"
                  :disabled="enabledTranslators.length === 0"
                ></v-select>
                <div class="caption grey--text mt-2">
                  {{
                    trans["fallbackTranslatorTip"] ||
                    "建议选择稳定且已配置完成的翻译器作为后备。"
                  }}
                </div>
                <div
                  v-if="enabledTranslators.length === 0"
                  class="caption error--text mt-1"
                >
                  {{ trans["noEnabledTranslators"] || "请先在上方启用翻译器" }}
                </div>
              </v-card-text>
            </v-card>
          </div>
        </v-tab-item>
        
        <v-tab-item style="min-height: 100%;">
          <div class="pa-3">
            <TranslatorGroupConfig
              configKey="translator-cache"
              :title="trans['cacheGroup'] || '缓存分组'"
              :description="trans['cacheGroupDesc'] || '配置自动查询并缓存结果的翻译器及其顺序'"
            ></TranslatorGroupConfig>
            
            <v-divider class="my-4"></v-divider>
            
            <TranslatorGroupConfig
              configKey="translator-compare"
              :title="trans['compareGroup'] || '对比分组'"
              :description="trans['compareGroupDesc'] || '配置多源对比模式下使用的翻译器及其顺序'"
            ></TranslatorGroupConfig>

            <v-divider class="my-4"></v-divider>
            
            <TranslatorGroupConfig
              configKey="translator-double"
              :title="trans['doubleGroup'] || '双击分组'"
              :description="trans['doubleGroupDesc'] || '配置双击复制/翻译时使用的翻译器及其顺序'"
            ></TranslatorGroupConfig>
          </div>
        </v-tab-item>
      </v-tabs-items>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Watch, Vue } from "vue-property-decorator";
import KeyConfig from "@/components/KeyConfig.vue";
import TranslatorGroupConfig from "@/components/TranslatorGroupConfig.vue";
import { Identifier } from "@/common/types";
import { TranslatorNameResolver } from "@/common/translate/translator-name-resolver";
import config from "@/common/configuration";
import eventBus from "@/common/event-bus";

@Component({
  components: {
    KeyConfig,
    TranslatorGroupConfig
  },
})
class TranslatorManager extends Vue {
  translatorList: Array<{id: string; name: string; enabled: boolean; cache: boolean}> = [];
  configVisibleIndexes: number[] = [];
  activeTab = 0;

  get trans() {
    return this.$store.getters.locale;
  }

  get availableTranslators(): string[] {
    return TranslatorNameResolver.getAllTranslatorIds();
  }

  get enabledTranslators(): string[] {
    return this.$store.state.config["translator-enabled"] || [];
  }

  get cacheTranslators(): string[] {
    return this.$store.state.config["translator-cache"] || [];
  }

  get fallbackTranslator(): string {
    return this.$store.state.config["fallbackTranslator"] || "baidu";
  }

  set fallbackTranslator(val: string) {
    this.callback("fallbackTranslator", val);
  }

  @Watch("enabledTranslators", { deep: true })
  @Watch("cacheTranslators", { deep: true })
  updateTranslatorList() {
    this.buildTranslatorList();
  }

  mounted() {
    this.buildTranslatorList();
  }

  buildTranslatorList() {
    this.translatorList = this.availableTranslators.map((id) => {
      return {
        id,
        name: this.getTranslatorName(id),
        enabled: this.enabledTranslators.includes(id),
        cache: this.cacheTranslators.includes(id),
      };
    });
  }

  getTranslatorName(translatorId: string): string {
    return TranslatorNameResolver.getDisplayName(translatorId, this.trans);
  }

  updateEnabled(translatorId: string, enabled: boolean) {
    if (enabled) {
      this.applyEnabledTranslators([...this.enabledTranslators, translatorId]);
    } else {
      this.applyEnabledTranslators(
        this.enabledTranslators.filter((id) => id !== translatorId)
      );
    }
  }

  isConfigComplete(translatorId: string): boolean {
    return this.getConfigStatus(translatorId).canEnable;
  }

  getConfigStatus(translatorId: string) {
    const id = translatorId as Identifier;
    if (!config.has(id)) {
      return { canSave: true, canEnable: true };
    }
    const value = this.$store.state.config[translatorId];
    return config.checkStatus(id, value);
  }

  getCheckboxTitle(translatorId: string): string {
    if (translatorId === 'google' && this.enabledTranslators.length <= 1) {
      return '至少需要启用一个翻译器';
    }

    const status = this.getConfigStatus(translatorId);
    if (!status.canEnable) {
      return status.enableReason || this.trans["configRequired"] || "请先配置翻译器";
    }

    return '';
  }

  updateCache(translatorId: string, cache: boolean) {
    let newCache = [...this.cacheTranslators];
    if (cache) {
      if (!newCache.includes(translatorId)) {
        newCache.push(translatorId);
      }
    } else {
      newCache = newCache.filter((id) => id !== translatorId);
    }
    this.applyCacheTranslators(newCache);
  }



  applyEnabledTranslators(newEnabled: string[]) {
    const enabled = Array.from(new Set(newEnabled)).filter((id) =>
      this.availableTranslators.includes(id)
    );
    const enabledSet = new Set(enabled);
    const cache = this.cacheTranslators.filter((id) => enabledSet.has(id));
    this.callback("translator-enabled", enabled);
    this.callback("translator-cache", cache);
    if (enabled.length > 0 && !enabledSet.has(this.fallbackTranslator)) {
      this.callback("fallbackTranslator", enabled[0]);
    }
  }

  applyCacheTranslators(newCache: string[]) {
    const enabledSet = new Set(this.enabledTranslators);
    const cache = Array.from(new Set(newCache)).filter((id) =>
      enabledSet.has(id)
    );
    this.callback("translator-cache", cache);
  }

  callback(...args: any[]) {
    eventBus.at("dispatch", ...args);
  }
}
export default TranslatorManager;
</script>

<style scoped>
.translator-row {
  display: grid;
  grid-template-columns: 60px minmax(150px, 1fr) 60px;
  align-items: center;
  column-gap: 8px;
  width: 100%;
  min-height: 48px;
}

.translator-header-row {
  display: grid;
  grid-template-columns: 60px minmax(150px, 1fr) 60px 48px;
  align-items: center;
  column-gap: 8px;
  width: 100%;
  font-size: 13px;
  font-weight: 500;
  color: #757575;
  padding: 8px 24px 8px 24px;
  background: #f5f5f5;
  border-radius: 4px;
  margin-bottom: 8px;
}

.translator-panels {
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  overflow: hidden;
}

.translator-panel {
  border-bottom: 1px solid #e0e0e0;
}

.translator-panel:last-child {
  border-bottom: none;
}

.translator-panel-header {
  padding: 0 0 0 24px !important;
  min-height: 48px !important;
  cursor: pointer !important;
}

.translator-panel-header:hover {
  background-color: #f9f9f9;
}

.translator-panel-header::v-deep .v-expansion-panel-header__icon {
  margin-left: 8px;
  margin-right: 16px;
  color: #757575;
}

.translator-header-cell {
  display: flex;
  align-items: center;
}

.translator-header-enable,
.translator-header-cache {
  justify-content: center;
}

.translator-header-expand {
  justify-content: center;
}

.translator-cell {
  display: flex;
  align-items: center;
}

.translator-enable,
.translator-cache {
  justify-content: center;
}

.translator-name {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 14px;
  font-weight: 500;
  color: #424242;
  cursor: help;
  padding: 4px 0;
}

.translator-name:hover {
  color: #1976d2;
}

.translator-checkbox {
  margin: 0 !important;
  padding: 0 !important;
}

.translator-checkbox::v-deep .v-input__slot {
  margin: 0 !important;
}

.translator-checkbox::v-deep .v-input--selection-controls__input {
  margin: 0 !important;
}
</style>
