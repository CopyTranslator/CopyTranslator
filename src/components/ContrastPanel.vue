<template>
  <div class="maxNoPad">
    <Focus class="maxNoPad areaWarpper" v-if="layoutType === 'focus'"></Focus>
    <v-row
      v-else-if="layoutType === 'horizontal'"
      class="maxNoPad"
      style="margin:0px;"
    >
      <v-col class="areaWarpper" @keyup.ctrl.13="translate">
        <textarea
          class="hArea"
          v-model="sharedResult.src"
          v-on:contextmenu="openMenu('contrastContext')"
        ></textarea>
      </v-col>
      <v-col class="areaWarpper">
        <textarea
          class="hArea"
          v-model="sharedResult.result"
          v-on:contextmenu="openMenu('contrastContext')"
        ></textarea>
      </v-col>
    </v-row>
    <v-col v-else class="maxNoPad">
      <div class="areaWarpper" style="height: 50%;" @keyup.ctrl.13="translate">
        <textarea
          class="vArea"
          v-model="sharedResult.src"
          v-on:contextmenu="openMenu('contrastContext')"
        ></textarea>
      </div>
      <div class="areaWarpper" style="height: 50%;">
        <textarea
          class="vArea"
          v-model="sharedResult.result"
          v-on:contextmenu="openMenu('contrastContext')"
        ></textarea>
      </div>
    </v-col>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import BaseView from "../components/BaseView.vue";
import { Mixins, Watch, Component } from "vue-property-decorator";
import WindowController from "../components/WindowController.vue";
import Focus from "./Focus.vue";
import { LayoutType, layoutTypes } from "../common/types";
import { ipcRenderer as ipc } from "electron";

@Component({
  components: {
    Focus: Focus
  }
})
export default class ContrastPanel extends Mixins(BaseView, WindowController) {
  get layoutType() {
    return this.config.layoutType;
  }

  set layoutType(layoutType) {
    this.set("layoutType", layoutType);
  }

  translate() {
    // this.$proxy.tryTranslate(this.sharedResult.src, true);
  }
}
</script>
<style scoped>
.hArea {
  height: 100%;
  width: 100%;
  border: solid 1px #bebebe;
  resize: none;
  padding: 0;
}
.vArea {
  height: 100%;
  width: 100%;
  border: solid 1px #bebebe;
  resize: none;
  padding: 0;
}
.maxNoPad {
  height: 100%;
  width: 100%;
  padding: 0px;
}
.areaWarpper {
  border: solid 1px #d3d3d3;
  padding: 0px;
}
.myswitch >>> .v-messages {
  min-height: 0px;
}
</style>
