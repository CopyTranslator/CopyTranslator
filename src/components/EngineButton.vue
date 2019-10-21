<template>
  <div class="engineBtn">
    <el-button
      v-bind:class="[engine, 'btnBase', { inactive: inactive }]"
      @click="switchTranslator"
      circle
    ></el-button>
  </div>
</template>

<script lang="ts">
import WindowController from "./WindowController.vue";
import Vue from "vue";
import Component, { mixins } from "vue-class-component";

const AppProps = Vue.extend({
  props: {
    engine: String
  }
});

@Component
export default class App extends mixins(WindowController, AppProps) {
  engineClass: string = this.engine;
  get inactive() {
    return this.$store.state.sharedResult.engine != this.engine;
  }
  switchTranslator() {
    this.callback("translatorType|" + this.engine);
  }
}
</script>

<style scoped>
.engineBtn {
  width: 100%;
  height: 100%;
}
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
.tencent {
  background-image: url("../images/tencent.png");
}
.btnBase {
  background-position: center;
  background-size: contain;
}
</style>
