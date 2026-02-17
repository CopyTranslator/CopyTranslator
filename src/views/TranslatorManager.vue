<template>
  <div style="text-align: left; overflow: auto; height: 100%;">
    <!-- 批量操作按钮 -->
    <div class="mb-4 d-flex align-center">
      <v-btn
        small
        @click="toggleAllEnabled(true)"
        class="mr-2"
        :title="trans['<tooltip>enableAll'] || '启用所有已配置翻译器'"
      >
        {{ trans["enableAll"] || "全部启用" }}
      </v-btn>
      <v-btn
        small
        @click="toggleAllEnabled(false)"
        class="mr-2"
        :title="trans['<tooltip>disableAll'] || '禁用全部翻译器并清空缓存'"
      >
        {{ trans["disableAll"] || "全部禁用" }}
      </v-btn>
      <v-btn
        small
        @click="toggleAllCache(true)"
        class="mr-2"
        :title="trans['<tooltip>cacheAll'] || '为已启用翻译器开启缓存'"
      >
        {{ trans["cacheAll"] || "全部缓存" }}
      </v-btn>
      <v-btn
        small
        @click="toggleAllCache(false)"
        class="mr-2"
        :title="trans['<tooltip>noCacheAll'] || '清空所有缓存设置'"
      >
        {{ trans["noCacheAll"] || "全部不缓存" }}
      </v-btn>
      <v-spacer></v-spacer>
      <v-btn
        small
        color="error"
        @click="restoreDefaults"
        :title="trans['<tooltip>restoreMultiDefault'] || '恢复翻译器相关设置为默认值'"
      >
        {{ trans["restoreMultiDefault"] || "恢复默认" }}
      </v-btn>
    </div>
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
    <v-expansion-panels multiple flat v-model="configVisibleIndexes">
      <v-expansion-panel
        v-for="translator in translatorList"
        :key="translator.id"
      >
        <v-expansion-panel-header>
          <div class="d-flex align-center flex-grow-1 py-2">
            <v-checkbox
              v-model="translator.enabled"
              @click.stop
              @change="updateEnabled(translator.id, translator.enabled)"
              :disabled="!isConfigComplete(translator.id) || (translator.id === 'google' && enabledTranslators.length <= 1)"
              :title="getCheckboxTitle(translator.id)"
              class="mr-3"
              hide-details
            ></v-checkbox>
            <div class="flex-grow-1 subtitle-2">{{ translator.name }}</div>
            <div class="ml-2 d-flex align-center" v-if="translator.enabled">
              <v-checkbox
                v-model="translator.cache"
                @click.stop
                @change="updateCache(translator.id, translator.cache)"
                hide-details
                class="d-inline-block mr-1"
                style="width: 18px; height: 18px;"
              ></v-checkbox>
              <span
                class="caption grey--text"
                :title="
                  trans['<tooltip>translator-cache'] ||
                  '缓存会自动查询并加速切换翻译器'
                "
              >
                {{ trans["cacheLabel"] || "缓存" }}
              </span>
            </div>
            <v-btn
              small
              text
              color="primary"
              @click.stop.prevent="toggleConfig(translator.id)"
              class="ml-2"
              :title="trans['<tooltip>translatorConfigButton'] || '打开该翻译器的配置项'"
            >
              {{ trans["configuration"] || "配置" }}
            </v-btn>
          </div>
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
</template>

<script lang="ts">
import { Component, Watch, Vue } from "vue-property-decorator";
import KeyConfig from "@/components/KeyConfig.vue";
import { translatorTypes, Identifier } from "@/common/types";
import { getTranslator } from "@/common/translate/translators";
import config from "@/common/configuration";
import eventBus from "@/common/event-bus";

@Component({
  components: {
    KeyConfig,
  },
})
class TranslatorManager extends Vue {
  translatorList: Array<{id: string; name: string; enabled: boolean; cache: boolean}> = [];
  configVisibleIndexes: number[] = [];

  get trans() {
    return this.$store.getters.locale;
  }

  get availableTranslators(): string[] {
    return translatorTypes;
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
    try {
      const translator = getTranslator(translatorId);
      return translator.name || translatorId;
    } catch (e) {
      return translatorId;
    }
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

  toggleConfig(translatorId: string) {
    const translatorIndex = this.translatorList.findIndex(t => t.id === translatorId);
    if (translatorIndex === -1) return;
    
    const visibleIndex = this.configVisibleIndexes.indexOf(translatorIndex);
    if (visibleIndex === -1) {
      this.configVisibleIndexes.push(translatorIndex);
    } else {
      this.configVisibleIndexes.splice(visibleIndex, 1);
    }
  }

  toggleAllEnabled(enabled: boolean) {
    if (enabled) {
      const configuredTranslators = this.availableTranslators.filter((translatorId) =>
        this.isConfigComplete(translatorId)
      );

      if (configuredTranslators.length === 0) {
        eventBus.at("dispatch", "toast", this.trans["configRequired"] || "请先配置翻译器后再启用");
        return;
      }

      this.applyEnabledTranslators(configuredTranslators);
    } else {
      this.applyEnabledTranslators([]);
    }
  }

  toggleAllCache(cache: boolean) {
    const newCache = cache ? [...this.enabledTranslators] : [];
    this.applyCacheTranslators(newCache);
  }

  restoreDefaults() {
    this.callback("restoreMultiDefault", "translation");
    this.callback("restoreMultiDefault", "translatorGroups");
    this.configVisibleIndexes = [];
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
</style>
