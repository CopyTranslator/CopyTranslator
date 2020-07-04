<template>
  <div>
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
import {
  translatorTypes,
  Identifier,
  compose,
  ActionView,
} from "../common/types";
import { Prop, Component, Watch, Vue } from "vue-property-decorator";
import bus from "../common/event-bus";

@Component
export default class EngineGroup extends Vue {
  @Prop({ default: undefined }) readonly identifier!: Identifier;
  readonly translatorTypes = translatorTypes;

  callback(...args: any[]) {
    bus.at("dispatch", ...args);
  }

  get value() {
    return this.$store.state.config[this.identifier];
  }

  set value(val) {
    this.callback(this.identifier, val);
  }
}
</script>

<style scoped></style>
