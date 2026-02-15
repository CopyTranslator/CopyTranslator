<template>
  <div>
    <div v-for="(_, key) in keyConfig" :key="key">
      <p>{{ key }}</p>
      <v-text-field
        v-model="keyConfig[key]"
        @change="sync()"
        v-if="!isSelect(key)"
      ></v-text-field>
      <v-select
        v-else
        v-model="keyConfig[key]"
        :items="getSelectOptions(key)"
        @change="sync()"
        style="margin: 0px; padding: 0px;"
      >
      </v-select>
    </div>
  </div>
</template>

<script lang="ts">
import { Identifier } from "../common/types";
import { FieldMetadata } from "../common/rule";
import config from "../common/configuration";
import { Prop, Component } from "vue-property-decorator";
import Base from "./Base.vue";

@Component
export default class KeyConfig extends Base {
  @Prop({ default: undefined }) readonly identifier!: Identifier;

  get keyConfig() {
    return this.$store.state.config[this.identifier];
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

  sync() {
    this.callback(this.identifier, this.keyConfig);
  }
}
</script>

<style scoped></style>
