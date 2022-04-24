<template>
  <div>
    <div v-if="!config['contrastDict'] || !dictResult.valid">
      <div v-if="chineseStyle">
        <span
          v-for="(val, key) in sentences"
          :key="key"
          @mouseover="mouseOver(key)"
          style="display: block;"
        >
          {{ val }}
        </span>
      </div>
      <div v-else>
        <div
          v-for="(val, key) in sentences"
          :key="key"
          @mouseover="mouseOver(key)"
        >
          <span style="display: block;">
            {{ val }}
          </span>
          <br />
        </div>
      </div>
    </div>
    <DictResultPanel
      v-if="config['contrastDict'] && dictResult.valid"
    ></DictResultPanel>
  </div>
</template>

<script lang="ts">
import { Mixins, Component, Vue, Watch } from "vue-property-decorator";
import DictResultPanel from "./DictResult.vue";
import BaseView from "./BaseView.vue";

const AppProps = Vue.extend({
  props: {
    sentences: Array,
    chineseStyle: Boolean,
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
/* span:hover {
  background: #fee972;
} */
</style>
