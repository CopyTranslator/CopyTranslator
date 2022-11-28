<template>
  <div></div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { Identifier } from "../common/types";
import { shell } from "electron";
import eventBus from "@/common/event-bus";
import logger from "@/common/logger";

@Component
export default class BaseView extends Vue {
  toKeyan() {
    shell.openExternal("https://www.keyanyuedu.com/?channel=copytranslator");
  }

  get trans() {
    return this.$store.getters.locale;
  }

  get valid() {
    return this.dictResult.valid && this.layoutType === "focus";
  }

  get currentEngine() {
    if (!this.valid) {
      if (this.multiSource) {
        return "copytranslator";
      } else {
        return this.$store.state.config.translatorType;
      }
    } else {
      return this.$store.state.config.dictionaryType;
    }
  }

  get multiSource() {
    return this.config.multiSource;
  }

  get layoutType() {
    return this.config.layoutType;
  }

  set layoutType(layoutType) {
    this.set("layoutType", layoutType);
  }

  get sharedResult() {
    return this.$store.state.sharedResult;
  }
  get sharedDiff() {
    return this.$store.state.sharedDiff;
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
    return this.config[this.layoutType].fontSize;
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

  created() {
    eventBus.on("translateInput", this.translate);
  }

  command() {
    const text = this.getModifiedText();
    eventBus.at("dispatch", text);
    logger.toast(`执行命令 ${text}`);
  }
}
</script>
