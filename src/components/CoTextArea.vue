<template>
  <div>
    <span
      v-for="(val, key) in sentences"
      :key="key"
      @mouseover="mouseOver(key)"
    >
      {{ val }}
    </span>
  </div>
</template>

<script lang="ts">
import { splitChn } from "@/common/translate/helper";
import { Mixins, Component, Vue, Watch } from "vue-property-decorator";

const AppProps = Vue.extend({
  props: {
    value: String,
  },
});

@Component
export default class CoTextArea extends Mixins(Vue, AppProps) {
  get sentences() {
    return splitChn(this.value);
  }

  mouseOver(idx: number) {
    console.log(idx);
    this.targetIdx = idx;
  }

  targetIdx: number = -1;
}
</script>

<style scoped>
span:hover {
  background: #fee972;
}
</style>
