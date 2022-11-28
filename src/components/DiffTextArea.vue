<template>
  <div>
    <div v-if="!config['contrastDict'] || !dictResult.valid">
      <div v-for="(part, key) in allParts" :key="key">
        <span style="color: red; font-size: 15px;">
          {{ part.engine }}
        </span>
        <a
          v-if="part.engine === 'keyan'"
          @click="toKeyan()"
          style="font-size: 15px;"
        >
          <span>来⾃棵岩翻译 免费⼀键翻译全⽂>>></span>
        </a>
        <br />
        <div v-bind:style="diffStyle">
          <div v-for="(line, k) in part.parts" :key="key + k">
            <span
              v-for="(p, k2) in line"
              :key="key + k + k2"
              :style="getStyle(p)"
              >{{ p.value }}</span
            >
          </div>
        </div>
      </div>
    </div>
    <DictResultPanel
      v-if="config['contrastDict'] && dictResult.valid"
    ></DictResultPanel>
  </div>
</template>

<script lang="ts">
import { Mixins, Component, Vue } from "vue-property-decorator";
import DictResultPanel from "./DictResult.vue";
import BaseView from "./BaseView.vue";

const AppProps = Vue.extend({
  props: {
    allParts: Array,
  },
});

@Component({
  components: {
    DictResultPanel,
  },
})
export default class DiffTextArea extends Mixins(Vue, AppProps, BaseView) {
  get diffFontSize() {
    return this.config[this.layoutType].diffFontSize;
  }

  get diffStyle() {
    return {
      fontSize: this.diffFontSize.toString() + "px",
    };
  }

  mouseOver(idx: number) {
    this.targetIdx = idx;
  }
  getStyle(p: any) {
    if (p.added) {
      return { color: "green" };
    }
    return {};
  }

  targetIdx: number = -1;
}
</script>

<style scoped>
/* span:hover {
  background: #fee972;
} */
</style>
