<template>
  <div></div>
</template>

<script lang="ts">
import { Component } from "vue-property-decorator";
import { shell } from "electron";
import eventBus from "@/common/event-bus";
import logger from "@/common/logger";
import Base from "./Base.vue";

type Name = "result" | "source" | "diff" | "dict";

@Component
export default class BaseView extends Base {
  toKeyan() {
    shell.openExternal("https://www.keyanyuedu.com/?channel=copytranslator");
  }

  get valid() {
    return (
      this.dictResult.valid &&
      (this.config.contrastDict || this.layoutType === "focus")
    );
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

  get sourceSize() {
    return this.config[this.layoutType].sourceFontSize;
  }

  get resultSize() {
    return this.config[this.layoutType].resultFontSize;
  }

  get diffSize() {
    return this.config[this.layoutType].diffFontSize;
  }

  get dictSize() {
    return this.config[this.layoutType].dictFontSize;
  }

  get layoutConfig() {
    return this.config[this.layoutType];
  }

  changeFont(name: Name, plus: boolean) {
    if (name == "result") {
      if (this.multiSource) {
        name = "diff";
      } else if (!this.config["contrastDict"] || !this.dictResult.valid) {
      } else if (this.config["contrastDict"] && this.dictResult.valid) {
        name = "dict";
      }
    }
    const n: Name = name;
    // console.log(n);
    //@ts-ignore
    const size: number = this[`${n}Size`];
    const fontKey = `${n}FontSize`;
    if (plus) {
      this.updateLayoutConfig({ [fontKey]: size + 1 });
    } else {
      this.updateLayoutConfig({ [fontKey]: size - 1 });
    }
  }

  wheelHandler(e: WheelEvent, name: Name) {
    if (!e.ctrlKey) {
      return;
    }
    if (e.deltaY > 0) {
      this.changeFont(name, false);
    } else if (e.deltaY < 0) {
      this.changeFont(name, true);
    } else {
      console.log(e, name);
    }
  }

  keyboardFontHandler(e: KeyboardEvent, name: Name) {
    if (e.key == "-") {
      this.changeFont(name, false);
    } else if (e.key == "=") {
      this.changeFont(name, true);
    } else {
      console.log(e);
    }
  }

  updateLayoutConfig(newLayoutConfig: any) {
    this.set(this.layoutType, { ...this.layoutConfig, ...newLayoutConfig });
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

  get appStyle() {
    return {
      "font-family": this.config.interfaceFontFamily,
    };
  }

  command() {
    const text = this.getModifiedText();
    eventBus.at("dispatch", text);
    logger.toast(`执行命令 ${text}`);
  }
}
</script>
