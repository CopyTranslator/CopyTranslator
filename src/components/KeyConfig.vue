<template>
  <div>
    <div class="d-flex justify-end mb-2" v-if="topSave">
      <v-btn
        small
        color="primary"
        @click="save()"
        :disabled="!isDirty"
      >
        {{ trans["saveConfig"] || "保存配置" }}
      </v-btn>
    </div>
    <v-alert
      v-if="noticeText || docUrl"
      dense
      text
      type="info"
      :icon="false"
      class="mb-2"
    >
      <span v-if="noticeText">{{ noticeText }}</span>
      <span v-if="noticeText && docUrl" class="mx-1">·</span>
      <a v-if="docUrl" :href="docUrl" @click.prevent="openDocUrl" rel="noopener">
        {{ trans["openReference"] || "配置指南" }}
      </a>
    </v-alert>
    <div v-for="(_, key) in keyConfigLocal" :key="key">
      <v-checkbox
        v-if="getUiType(key) === 'checkbox'"
        v-model="keyConfigLocal[key]"
        :label="getLabel(key)"
        dense
        hide-details
        class="mt-4"
      ></v-checkbox>

      <v-select
        v-else-if="getUiType(key) === 'select'"
        v-model="keyConfigLocal[key]"
        :items="getSelectOptions(key)"
        :label="getLabel(key)"
        dense
        hide-details
        class="mt-6"
      ></v-select>

      <v-text-field
        v-else-if="getUiType(key) === 'number'"
        v-model.number="keyConfigLocal[key]"
        type="number"
        :label="getLabel(key)"
        dense
        hide-details
        class="mt-6"
      ></v-text-field>

      <v-text-field
        v-else
        v-model="keyConfigLocal[key]"
        :type="getInputType(key)"
        :label="getLabel(key)"
        dense
        hide-details
        class="mt-6"
      ></v-text-field>
    </div>
    <v-btn
      v-if="!topSave"
      small
      color="primary"
      class="mt-2"
      @click="save()"
      :disabled="!isDirty"
    >
      {{ trans["saveConfig"] || "保存配置" }}
    </v-btn>
    <v-alert
      v-if="saveMessage"
      dense
      text
      class="mt-2 mb-0"
      :type="saveMessageType"
    >
      {{ saveMessage }}
    </v-alert>
  </div>
</template>

<script lang="ts">
import { Identifier, translatorTypes } from "../common/types";
import { shell } from "electron";
import { FieldMetadata } from "../common/rule";
import config from "../common/configuration";
import { Prop, Component, Watch } from "vue-property-decorator";
import Base from "./Base.vue";

@Component
class KeyConfig extends Base {
  @Prop({ default: undefined }) readonly identifier!: Identifier;
  @Prop({ default: false }) readonly topSave!: boolean;
  keyConfigLocal: Record<string, any> = {};
  saveMessage = "";
  saveMessageType: "success" | "error" = "success";

  get keyConfig() {
    return this.$store.state.config[this.identifier];
  }

  get isDirty() {
    return JSON.stringify(this.keyConfigLocal) !== JSON.stringify(this.keyConfig);
  }

  get noticeText() {
    if (!config.has(this.identifier)) {
      return "";
    }
    const rule = config.getRule(this.identifier);
    const notice = rule?.notice;
    if (!notice) {
      return "";
    }
    return this.trans[notice] || notice;
  }

  get docUrl() {
    if (!config.has(this.identifier)) {
      return "";
    }
    const rule = config.getRule(this.identifier);
    return rule?.docUrl || "";
  }

  openDocUrl() {
    if (!this.docUrl) {
      return;
    }
    shell.openExternal(this.docUrl);
  }

  mounted() {
    this.resetLocal();
  }

  @Watch("identifier")
  onIdentifierChange() {
    this.resetLocal();
  }

  resetLocal() {
    const current = this.keyConfig || {};
    this.keyConfigLocal = JSON.parse(JSON.stringify(current));
    this.saveMessage = "";
  }

  getFieldMetadata(key: string | number): FieldMetadata | undefined {
    try {
      const rule = config.getRule(this.identifier);
      const metadata = rule?.metadata?.[key];
      
      return metadata;
    } catch (e) {
      console.error(`[KeyConfig] getFieldMetadata error:`, e);
      return undefined;
    }
  }

  isSelect(key: string | number): boolean {
    const metadata = this.getFieldMetadata(key);
    const result = metadata?.uiType === "select";
    console.log(`[KeyConfig] isSelect - key: ${key}, result: ${result}`);
    return result;
  }

  getSelectOptions(key: string | number): string[] {
    const metadata = this.getFieldMetadata(key);
    const options = metadata?.options ? [...metadata.options] : [];
    // console.log(`[KeyConfig] getSelectOptions - key: ${key}, options:`, options);
    return options;
  }

  getUiType(key: string | number): string {
    const metadata = this.getFieldMetadata(key);
    return metadata?.uiType || "text";
  }

  getLabel(key: string | number): string {
    const metadata = this.getFieldMetadata(key);
    const labelKey = metadata?.label || key.toString();
    return this.trans[labelKey] || labelKey;
  }

  getInputType(key: string | number): string {
    const uiType = this.getUiType(key);
    if (uiType === "number") return "number";
    const k = key.toString().toLowerCase();
    if (k.includes("password") || k.includes("secret")) return "password";
    return "text";
  }

  save() {
    // 预处理：修复空值和类型问题
    for (const key of Object.keys(this.keyConfigLocal)) {
      const val = this.keyConfigLocal[key];
      // 如果值为 null 或 undefined，且 UI 类型为文本，则转为空字符串
      if (val == null) {
        const uiType = this.getUiType(key);
        if (uiType === 'text' || uiType === 'textarea' || uiType === 'select') {
          this.keyConfigLocal[key] = "";
        }
      }
    }
    const status = config.checkStatus(this.identifier, this.keyConfigLocal);
    if (status.canSave) {
      this.callback(this.identifier, this.keyConfigLocal);
      if (translatorTypes.includes(this.identifier as any)) {
        const enabled = [...(this.$store.state.config["translator-enabled"] || [])];
        const cache = [...(this.$store.state.config["translator-cache"] || [])];
        if (status.canEnable) {
          const nextEnabled = Array.from(
            new Set([...enabled, this.identifier])
          ).filter((id: string) => translatorTypes.includes(id as any));
          if (
            nextEnabled.length !== enabled.length ||
            !enabled.includes(this.identifier)
          ) {
            this.callback("translator-enabled", nextEnabled);
          }
          const nextCache = cache.filter((id: string) =>
            nextEnabled.includes(id)
          );
          if (nextCache.length !== cache.length) {
            this.callback("translator-cache", nextCache);
          }
          const fallback = this.$store.state.config["fallbackTranslator"];
          if (nextEnabled.length > 0 && !nextEnabled.includes(fallback)) {
            this.callback("fallbackTranslator", nextEnabled[0]);
          }
        } else {
          const nextEnabled = enabled.filter((id: string) => id !== this.identifier);
          if (nextEnabled.length !== enabled.length) {
            this.callback("translator-enabled", nextEnabled);
          }
          const nextCache = cache.filter((id: string) => id !== this.identifier);
          if (nextCache.length !== cache.length) {
            this.callback("translator-cache", nextCache);
          }
        }
      }
      this.saveMessage =
        this.trans["configSaveSuccess"] || "已保存并通过校验";
      this.saveMessageType = "success";
    } else {
      this.saveMessage =
        status.saveReason ||
        this.trans["configSaveInvalid"] ||
        "配置未通过校验，请检查必填项";
      this.saveMessageType = "error";
    }
  }
}
export default KeyConfig;
</script>

<style scoped></style>
