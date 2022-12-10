<template>
  <div></div>
</template>

<script lang="ts">
import { Component } from "vue-property-decorator";
import { shell } from "electron";
import eventBus from "@/common/event-bus";
import logger from "@/common/logger";
import Base from "./Base.vue";
import { SharedResult } from "@/common/translate/types";

type Name = "result" | "source" | "diff" | "dict";

@Component
export default class BaseView extends Base {
  toKeyan() {
    shell.openExternal("https://www.keyanyuedu.com/?channel=copytranslator");
  }

  get currentEngine() {
    switch (this.mode) {
      case "dict":
        return this.config.dictionaryType;
      case "diff":
        return "copytranslator";
      case "normal":
      case "none":
        return this.config.translatorType;
      default:
        throw this.mode;
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

  get sharedResult(): SharedResult {
    return this.$store.state.sharedResult;
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
  // 要支持translateInput必须要实现该方法
  getModifiedText(): string | undefined {
    return undefined;
  }

  translate() {
    const text = this.getModifiedText();
    if (text == undefined) {
      return;
    }
    eventBus.at("dispatch", "translate", text);
  }

  created() {
    eventBus.on("translateInput", this.translate);
  }

  get appStyle() {
    return {
      "font-family": this.config.interfaceFontFamily,
    };
  }

  get mode() {
    if (this.multiSource) {
      return "diff";
    }
    if (this.config.smartDict && this.dictResult.valid) {
      return "dict";
    }
    if (this.sharedResult.status === "None") {
      return "none";
    }
    return "normal";
  }

  command() {
    const text = this.getModifiedText();
    eventBus.at("dispatch", text);
    logger.toast(`执行命令 ${text}`);
  }
}
</script>
