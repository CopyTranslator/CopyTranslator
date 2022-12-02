<template>
  <div style="text-align: left;">
    <p>{{ identifier }}</p>
    <v-select
      v-model="value"
      :items="translatorTypes"
      style="margin: 0px; padding: 0px;"
      multiple
      chips
    >
    </v-select>
  </div>
</template>

<script lang="ts">
import { translatorTypes, Identifier } from "../common/types";
import { Prop, Component } from "vue-property-decorator";
import Base from "./Base.vue";

@Component
export default class MultiSelect extends Base {
  @Prop({ default: undefined }) readonly identifier!: Identifier;
  readonly translatorTypes = translatorTypes;

  get value() {
    return this.$store.state.config[this.identifier];
  }

  set value(val) {
    this.callback(this.identifier, val);
  }
}
</script>

<style scoped></style>
