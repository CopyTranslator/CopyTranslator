<template>
  <v-tooltip bottom open-delay="100" :disabled="!tooltipText">
    <template v-slot:activator="{ on, attrs }">
      <v-btn
        v-bind:class="[engineClass, 'engineBtnBase']"
        v-bind="attrs"
        v-on="on"
        @click="switchTranslator"
        color="white"
        x-small
        fab
        :height="buttonSize"
        :width="buttonSize"
      ></v-btn>
    </template>
    <span>{{ tooltipText }}</span>
  </v-tooltip>
</template>

<script lang="ts">
import Vue from "vue";
import Component, { mixins } from "vue-class-component";
import config from "@/common/configuration";
import Base from "./Base.vue";
import "@/css/shared-styles.css";

const AppProps = Vue.extend({
  props: {
    engine: String,
    valid: Boolean,
    tooltip: String,
    enable: {
      type: Boolean,
      default: true,
    },
  },
});

@Component
export default class EngineButton extends mixins(AppProps, Base) {
  get engineClass() {
    if (this.engine == "baidu-domain") {
      return `${this.engine}-${config.get<any>("baidu-domain").domain}`;
    } else {
      return this.engine;
    }
  }

  get buttonSize() {
    return `${this.titlebarHeightVal - 2}px`;
  }

  get tooltipText() {
    if (this.tooltip == undefined && this.engine == "copytranslator") {
      return this.trans["multiSourceButton"]; //多源对比
    } else {
      return this.tooltip;
    }
  }

  switchTranslator() {
    if (!this.enable) {
      return;
    }
    if (this.valid) {
      this.callback("dictionaryType", this.engine);
    } else {
      if (this.engine == "copytranslator") {
        this.callback("multiSource", true); //设置多源翻译
      } else {
        this.callback("multiSource", false); //关闭多源翻译
        this.callback("translatorType", this.engine);
      }
    }
  }
}
</script>

<style scoped>
.inactive {
  filter: grayscale(90%);
}
</style>
