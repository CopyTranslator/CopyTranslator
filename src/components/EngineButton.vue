<template>
  <v-tooltip bottom open-delay="100" :disabled="!tooltipText">
    <template v-slot:activator="{ on, attrs }">
      <v-btn
        v-bind:class="[engineClass, 'btnBase']"
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
.baidu {
  background-image: url("../images/baidu.svg");
}
.google {
  background-image: url("../images/google.svg");
}
.caiyun {
  background-image: url("../images/caiyun.png");
}
.keyan {
  background-image: url("../images/keyan.svg");
}
.sogou {
  background-image: url("../images/sogou.svg");
}
.youdao {
  background-image: url("../images/youdao.png");
}
.bing {
  background-image: url("../images/bing.png");
}
.deepl {
  background-image: url("../images/deepl.svg");
}
.tencent {
  background-image: url("../images/tencent.png");
}
.baidu-domain-electronics {
  background-image: url("../images/electronics.svg");
}

.baidu-domain-mechanics {
  background-image: url("../images/mechanics.svg");
}

.baidu-domain-medicine {
  background-image: url("../images/medicine.svg");
}

.copytranslator {
  background-image: url("../images/icon.png");
}

.btnBase {
  background-position: center;
  background-size: contain;
}
</style>
