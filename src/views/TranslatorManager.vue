<template>
  <div style="text-align: left; overflow: auto; height: 100%;">
    <!-- 批量操作按钮 -->
    <div class="mb-4 d-flex align-center">
      <v-btn small @click="toggleAllEnabled(true)" class="mr-2">
        {{ trans["enableAll"] || "全部启用" }}
      </v-btn>
      <v-btn small @click="toggleAllEnabled(false)" class="mr-2">
        {{ trans["disableAll"] || "全部禁用" }}
      </v-btn>
      <v-btn small @click="toggleAllCache(true)" class="mr-2">
        {{ trans["cacheAll"] || "全部缓存" }}
      </v-btn>
      <v-btn small @click="toggleAllCache(false)" class="mr-2">
        {{ trans["noCacheAll"] || "全部不缓存" }}
      </v-btn>
      <v-spacer></v-spacer>
      <v-btn small color="error" @click="restoreDefaults">
        {{ trans["restoreMultiDefault"] || "恢复默认" }}
      </v-btn>
    </div>

    <!-- 翻译器列表 -->
    <v-expansion-panels multiple flat v-model="configVisibleIndexes">
      <v-expansion-panel
        v-for="(translator, index) in translatorList"
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
              <span class="caption grey--text">缓存</span>
            </div>
            <v-btn
              small
              text
              color="primary"
              @click.stop.prevent="toggleConfig(translator.id)"
              class="ml-2"
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
        ></v-select>
      </v-card-text>
    </v-card>
  </div>
</template>

<script lang="ts">
import { Component, Watch, Vue } from "vue-property-decorator";
import KeyConfig from "@/components/KeyConfig.vue";
import { translatorTypes } from "@/common/types";
import { getTranslator } from "@/common/translate/translators";
import eventBus from "@/common/event-bus";

@Component({
  components: {
    KeyConfig,
  },
})
export default class TranslatorManager extends Vue {
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
    let newEnabled = [...this.enabledTranslators];
    if (enabled) {
      if (!newEnabled.includes(translatorId)) {
        newEnabled.push(translatorId);
      }
    } else {
      newEnabled = newEnabled.filter((id) => id !== translatorId);
      let newCache = this.cacheTranslators.filter((id) => id !== translatorId);
      this.callback("translator-cache", newCache);
      if (this.fallbackTranslator === translatorId && newEnabled.length > 0) {
        this.callback("fallbackTranslator", newEnabled[0]);
      }
    }
    this.callback("translator-enabled", newEnabled);
  }

  isConfigComplete(translatorId: string): boolean {
    const config = this.$store.state.config[translatorId];
    if (!config || typeof config !== "object") {
      return false;
    }

    return Object.values(config).every(
      (value) => value !== undefined && value !== ""
    );
  }

  getCheckboxTitle(translatorId: string): string {
    if (translatorId === 'google' && this.enabledTranslators.length <= 1) {
      return '至少需要启用一个翻译器';
    }

    if (!this.isConfigComplete(translatorId)) {
      return this.trans["configRequired"] || "请先配置翻译器";
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
    this.callback("translator-cache", newCache);
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

      this.callback("translator-enabled", configuredTranslators);
    } else {
      this.callback("translator-enabled", []);
      this.callback("translator-cache", []);
    }
  }

  toggleAllCache(cache: boolean) {
    const newCache = cache ? [...this.enabledTranslators] : [];
    this.callback("translator-cache", newCache);
  }

  restoreDefaults() {
    this.callback("restoreMultiDefault", "translation");
    this.callback("restoreMultiDefault", "translatorGroups");
    this.configVisibleIndexes = [];
  }

  callback(...args: any[]) {
    eventBus.at("dispatch", ...args);
  }
}
</script>

<style scoped>
</style>
