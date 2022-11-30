<template>
  <div contenteditable="true">
    <div v-if="(allParts.length==0)">
      <h2>暂无多源对比结果，请翻译一句新的</h2>
    </div>
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
  </div>
</template>

<script lang="ts">
import { Mixins, Component, Prop } from "vue-property-decorator";
import BaseView from "./BaseView.vue";
import { CompareResult } from "../common/translate/comparator";

@Component
export default class DiffTextArea extends Mixins(BaseView) {
  @Prop({ default: [] }) readonly allParts!: CompareResult[];

  get diffStyle() {
    return {
      fontSize: this.diffSize.toString() + "px",
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
