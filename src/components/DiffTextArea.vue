<template>
  <div contenteditable="true" :style="colorStyle">
    <div>
      <div v-for="(result, engine) in resultBuffer" :key="engine">
        <v-btn
          v-bind:class="[engine, 'engineBtnBase']"
          icon
          width="18px"
          height="18px"
        ></v-btn>
        <span style="color: red; font-size: 15px; text-transform: capitalize;">
          {{ engine }}
        </span>
        <v-btn
          v-if="result.status !== 'Translating'"
          color="primary"
          icon
          class="btn"
          width="18px"
          height="18px"
          @click="callback('copyResult', engine)"
        >
          <v-icon size="18px"> mdi-content-copy </v-icon>
        </v-btn>
        <v-progress-circular
          v-else
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
          <span>&nbsp;来⾃棵岩翻译 免费⼀键翻译全⽂>>></span>
        </a>
        <br />
        <div v-bind:style="diffStyle">
          <div v-if="compareResult[engine]">
            <div v-for="(line, k) in compareResult[engine]" :key="k">
              <span
                v-for="(p, k2) in line"
                :key="k + k2"
                :style="getStyle(p)"
                >{{ p.value }}</span
              >
            </div>
          </div>
          <div v-else>{{ result.translation }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Mixins, Component } from "vue-property-decorator";
import BaseView from "./BaseView.vue";
import { ResultBuffer } from "@/common/translate/types";
import { compareAll, CompareResult } from "@/renderer/comparator";
import "@/css/shared-styles.css";

@Component
export default class DiffTextArea extends Mixins(BaseView) {
  get compareResult(): CompareResult {
    if (Object.keys(this.validResults).length > 1) {
      return compareAll(this.resultBuffer);
    } else {
      return {};
    }
  }

  get validResults(): ResultBuffer {
    const valids: ResultBuffer = {};
    Object.entries(this.resultBuffer).map(([key, item]) => {
      if (item.status != "Translating") {
        valids[key] = item;
      }
    });
    return valids;
  }

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

.btn {
  padding: 0px !important;
  min-width: 0px !important;
}
</style>
