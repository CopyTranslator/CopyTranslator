<template>
  <v-btn
    v-bind:class="[engineClass, 'btnBase']"
    @click="switchTranslator"
    color="white"
    x-small
    fab
  ></v-btn>
</template>

<script lang="ts">
import WindowController from "./WindowController.vue";
import Vue from "vue";
import Component, { mixins } from "vue-class-component";
import config from "@/common/configuration";
import eventBus from "@/common/event-bus";

const AppProps = Vue.extend({
  props: {
    engine: String,
    valid: Boolean,
    enable: {
      type: Boolean,
      default: true,
    },
  },
});

@Component
export default class EngineButton extends mixins(WindowController, AppProps) {
  get engineClass() {
    if (this.engine == "baidu-domain") {
      return `${this.engine}-${config.get("baidu-domain").domain}`;
    } else {
      return this.engine;
    }
  }

  switchTranslator() {
    if (!this.enable) {
      return;
    }
    if (this.valid) {
      this.callback("dictionaryType|" + this.engine);
    } else {
      this.callback("translatorType|" + this.engine);
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
.sogou {
  background-image: url("../images/sogou.svg");
}
.youdao {
  background-image: url("../images/youdao.png");
}
.bing {
  background-image: url("../images/bing.png");
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

.btnBase {
  background-position: center;
  background-size: contain;
}
</style>
