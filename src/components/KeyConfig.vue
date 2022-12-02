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
        :items="domains"
        @change="sync()"
        style="margin: 0px; padding: 0px;"
      >
      </v-select>
    </div>
  </div>
</template>

<script lang="ts">
import { domains, Identifier } from "../common/types";
import { Prop, Component } from "vue-property-decorator";
import Base from "./Base.vue";

@Component
export default class KeyConfig extends Base {
  @Prop({ default: undefined }) readonly identifier!: Identifier;
  readonly domains = domains;

  get keyConfig() {
    return this.$store.state.config[this.identifier];
  }

  isSelect(key: string | number) {
    return this.identifier == "baidu-domain" && key == "domain";
  }

  sync() {
    this.callback(this.identifier, this.keyConfig);
  }
}
</script>

<style scoped></style>
