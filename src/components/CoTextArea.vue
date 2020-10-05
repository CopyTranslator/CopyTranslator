<template>
  <div>
    <div v-if="!config['contrastDict'] & !dictResult.valid">
      <span
        v-for="(val, key) in sentences"
        :key="key"
        @mouseover="mouseOver(key)"
      >
        {{ val }}
      </span>
    </div>
    <DictResultPanel
      v-if="config['contrastDict'] & dictResult.valid"
    ></DictResultPanel>
  </div>
</template>

<script lang="ts">
import { splitChn } from "@/common/translate/helper";
import { Mixins, Component, Vue, Watch } from "vue-property-decorator";
import DictResultPanel from "./DictResult.vue";
import BaseView from "./BaseView.vue";

const AppProps = Vue.extend({
  props: {
    sentences: Array,
  },
});

@Component({
  components: {
    DictResultPanel,
  },
})
export default class CoTextArea extends Mixins(Vue, AppProps, BaseView) {
  mouseOver(idx: number) {
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
