<template>
  <div contenteditable="true" :style="colorStyle">
    <div>
      <div v-for="(result, engine) in resultBuffer" :key="engine">
        <div>
          <span style="color: red; font-size: 15px;"> {{ engine }} </span>
          <v-progress-circular
            v-if="result.status == 'Translating'"
            :size="15"
            :width="2"
            color="primary"
            :indeterminate="result.status == 'Translating'"
            value="100"
          >
          </v-progress-circular>
          <a
            v-if="engine === 'keyan'"
            @click="toKeyan()"
            style="font-size: 15px;"
          >
            <span>来⾃棵岩翻译 免费⼀键翻译全⽂>>></span>
          </a>
          <br />
          {{ result.translation }}
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Mixins, Component } from "vue-property-decorator";
import BaseView from "./BaseView.vue";
import { ResultBuffer } from "../common/translate/types";

@Component
export default class DiffTextArea extends Mixins(BaseView) {
  get resultBuffer(): ResultBuffer {
    return this.config.resultBuffer;
  }

  get diffStyle() {
    return {
      fontSize: this.diffSize.toString() + "px",
    };
  }

  get colorStyle() {
    return {
      color: this.fontColor,
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
