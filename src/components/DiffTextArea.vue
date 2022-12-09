<template>
  <div
    contenteditable="true"
    :style="colorStyle"
    @contextmenu="openMenu('diffContext')"
  >
    <div>
      <div
        v-for="(result, engine) in resultBuffer"
        :key="engine"
        style="margin-left: 2px;"
      >
        <div style="height: 22px; display: flex;">
          <v-btn
            v-bind:class="[engine, 'engineBtnBase']"
            icon
            width="22px"
            height="22px"
            style="margin-top: auto; margin-bottom: auto;"
          ></v-btn>
          <span class="engineSpan">
            {{ engine }}
          </span>
          <v-btn
            color="primary"
            icon
            class="btn"
            width="22px"
            height="22px"
            @click="callback('copyResult', engine)"
            style="margin-top: auto; margin-bottom: auto;"
            v-if="result.status !== 'Translating'"
          >
            <v-icon size="22px"> mdi-content-copy </v-icon>
          </v-btn>
          <v-progress-circular
            v-else
            :size="20"
            :width="2"
            color="primary"
            :indeterminate="result.status == 'Translating'"
            style="margin-top: auto; margin-bottom: auto;"
            value="100"
          >
          </v-progress-circular>
          <a
            v-if="engine === 'keyan'"
            @click="toKeyan()"
            style="font-size: 15px; margin-left: 5px;"
          >
            <span>&nbsp;&nbsp; 来⾃棵岩翻译 免费⼀键翻译全⽂>>></span>
          </a>
        </div>

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
    return this.$store.state.resultBuffer;
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
.engineSpan {
  color: red;
  font-size: 15px;
  text-transform: capitalize;
  padding-left: 2px;
  padding-right: 2px;
  text-align: center;
  min-width: 65px;
}
</style>
