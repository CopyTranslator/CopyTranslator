<template>
  <div>
    <div v-for="(_, key) in keyConfigLocal" :key="key">
      <p>{{ key }}</p>
      <v-text-field
        v-model="keyConfigLocal[key]"
        v-if="!isSelect(key)"
      ></v-text-field>
      <v-select
        v-else
        v-model="keyConfigLocal[key]"
        :items="getSelectOptions(key)"
        style="margin: 0px; padding: 0px;"
      >
      </v-select>
    </div>
    <v-alert
      v-if="noticeText"
      dense
      text
      type="info"
      class="mt-2 mb-0"
    >
      {{ noticeText }}
    </v-alert>
    <v-btn
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
import { FieldMetadata } from "../common/rule";
import config from "../common/configuration";
import { Prop, Component, Watch } from "vue-property-decorator";
import Base from "./Base.vue";

@Component
class KeyConfig extends Base {
  @Prop({ default: undefined }) readonly identifier!: Identifier;
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
      console.log(`[KeyConfig] getFieldMetadata - identifier: ${this.identifier}, key: ${key}, metadata:`, metadata);
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
    console.log(`[KeyConfig] getSelectOptions - key: ${key}, options:`, options);
    return options;
  }

  save() {
    const status = config.checkStatus(this.identifier, this.keyConfigLocal);
    if (status.canSave) {
      this.callback(this.identifier, this.keyConfigLocal);
      if (!status.canEnable && translatorTypes.includes(this.identifier as any)) {
        const enabled = [...(this.$store.state.config["translator-enabled"] || [])];
        const cache = [...(this.$store.state.config["translator-cache"] || [])];
        const nextEnabled = enabled.filter((id: string) => id !== this.identifier);
        if (nextEnabled.length !== enabled.length) {
          this.callback("translator-enabled", nextEnabled);
        }
        const nextCache = cache.filter((id: string) => id !== this.identifier);
        if (nextCache.length !== cache.length) {
          this.callback("translator-cache", nextCache);
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
