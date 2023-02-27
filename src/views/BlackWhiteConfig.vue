<template>
  <div>
    <Action :identifier="tipName"></Action>
    <Action :identifier="optionName"></Action>
    <br />
    <Action :identifier="modeName"></Action>
    <p v-if="config[modeName] !== globalName" style="color: red;">
      {{ trans[promptName] }}
    </p>
    <div v-if="config[modeName] === whitelistName">
      <p>{{ trans[whitelistName] }}:</p>
      <v-select
        v-model="whitelist"
        :items="config.activeWindows"
        style="margin: 0px; padding: 0px;"
        multiple
        chips
      >
      </v-select>
    </div>
    <div v-if="config[modeName] === blacklistName">
      <p>{{ trans[blacklistName] }}:</p>
      <v-select
        v-model="blacklist"
        :items="config.activeWindows"
        style="margin: 0px; padding: 0px;"
        multiple
        chips
      >
      </v-select>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop } from "vue-property-decorator";
import Action from "../components/Action.vue";
import Base from "@/components/Base.vue";

@Component({
  components: { Action },
})
export default class BlackWhiteConfig extends Base {
  @Prop({ default: [] }) readonly optionName!: string;

  get modeName() {
    return `${this.optionName}Mode`;
  }
  get blacklistName() {
    return `${this.optionName}BlackList`;
  }

  get whitelistName() {
    return `${this.optionName}WhiteList`;
  }

  get globalName() {
    return `${this.optionName}Global`;
  }

  get tipName() {
    return `${this.optionName}Tip`;
  }
  get promptName() {
    return `${this.optionName}Prompt`;
  }

  get whitelist() {
    return this.$store.state.config[this.whitelistName];
  }

  set whitelist(val) {
    this.callback(this.whitelistName, val);
  }

  get blacklist() {
    return this.$store.state.config[this.blacklistName];
  }

  set blacklist(val) {
    this.callback(this.blacklistName, val);
  }
}
</script>

<style scoped></style>
