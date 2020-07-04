<template>
  <div>
    <div v-for="(vulue, key) in config" :key="key">
      <p>{{ key }}</p>
      <v-text-field
        v-model="config[key]"
        @change="sync(key)"
        v-if="!isSelect(key)"
      ></v-text-field>
      <v-select
        v-else
        v-model="config[key]"
        :items="domains"
        @change="sync(key)"
        style="margin: 0px; padding: 0px;"
      >
      </v-select>
    </div>
  </div>
</template>

<script lang="ts">
import { domains, Identifier, compose, ActionView } from "../common/types";
import { Prop, Component, Watch, Vue } from "vue-property-decorator";
import bus from "../common/event-bus";

@Component
export default class KeyConfig extends Vue {
  @Prop({ default: undefined }) readonly identifier!: Identifier;
  readonly domains = domains;

  callback(...args: any[]) {
    bus.at("dispatch", ...args);
  }

  get config() {
    return this.$store.state.config[this.identifier];
  }

  isSelect(key: string) {
    return this.identifier == "baidu-domain" && key == "domain";
  }

  sync(key: string) {
    this.callback(this.identifier, this.config);
  }

  get trans() {
    return this.$store.getters.locale;
  }
}
</script>

<style scoped></style>
