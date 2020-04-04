<template>
  <v-btn
    v-bind:class="[engine, 'btnBase', { inactive: inactive }]"
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

const AppProps = Vue.extend({
  props: {
    engine: String,
    valid: Boolean
  }
});

@Component
export default class App extends mixins(WindowController, AppProps) {
  engineClass: string = this.engine;
  get inactive() {
    return this.valid
      ? this.$store.state.dictResult.engine != this.engine
      : this.$store.state.sharedResult.engine != this.engine;
  }
  switchTranslator() {
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
.btnBase {
  background-position: center;
  background-size: contain;
}
</style>
