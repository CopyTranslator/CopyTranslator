<template>
  <div></div>
</template>

<script lang="ts">
import { Watch, Component, Vue, Mixins } from "vue-property-decorator";
import { Identifier } from "../common/types";
import { shell } from "electron";
import eventBus from "@/common/event-bus";

@Component
export default class BaseView extends Vue {
  get sharedResult() {
    return this.$store.state.sharedResult;
  }

  get dictResult() {
    return this.$store.state.dictResult;
  }

  get config() {
    return this.$store.state.config;
  }

  set(key: Identifier, val: any) {
    this.$controller.set(key, val);
  }

  get size() {
    return this.config.contrast.fontSize;
  }

  baidu() {
    shell.openExternal(
      `https://www.baidu.com/s?ie=utf-8&wd=${this.getModifiedText()}`
    );
  }

  google() {
    shell.openExternal(
      `https://www.google.com/search?q=${this.getModifiedText()}`
    );
  }

  getModifiedText(): string {
    return "";
  }

  translate() {
    const text = this.getModifiedText();
    eventBus.at("dispatch", "translate", text);
    this.$store.dispatch("clearShared");
    this.$store.dispatch("setDictResult", {
      valid: false,
    });
  }
}
</script>
