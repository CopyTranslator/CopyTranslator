<template>
  <div class="maxNoPad">
    <Focus class="maxNoPad areaWarpper" v-if="layoutType === 'focus'"></Focus>
    <v-row
      v-else-if="layoutType === 'horizontal'"
      class="maxNoPad"
      style="margin: 0px;"
    >
      <v-col class="areaWarpper">
        <textarea
          v-bind:style="fontStyle"
          class="hArea"
          @keyup.ctrl.13="translate"
          @keyup.ctrl.71="google"
          @keyup.ctrl.66="baidu"
          @select="onSelect"
          v-model="sharedResult.text"
          v-on:contextmenu="openMenu('contrastContext')"
        ></textarea>
      </v-col>
      <v-col class="areaWarpper" v-on:contextmenu="openMenu('contrastContext')">
        <CoTextArea
          class="hArea"
          v-bind:style="fontStyle"
          :sentences="sharedResult.transPara"
          ref="myhead"
        ></CoTextArea>
        <p>{{ idx }}</p>
      </v-col>
    </v-row>
    <v-col v-else class="maxNoPad">
      <div class="areaWarpper" style="height: 50%;" @keyup.ctrl.13="translate">
        <textarea
          v-bind:style="fontStyle"
          @keyup.ctrl.13="translate"
          @keyup.ctrl.71="google"
          @keyup.ctrl.66="baidu"
          class="vArea"
          v-model="sharedResult.text"
          v-on:contextmenu="openMenu('contrastContext')"
        ></textarea>
      </div>
      <div class="areaWarpper" style="height: 50%;">
        <textarea
          class="vArea"
          v-bind:style="fontStyle"
          v-model="sharedResult.translation"
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
import eventBus from "@/common/event-bus";
import CoTextArea from "./CoTextArea.vue";

@Component({
  components: {
    Focus: Focus,
    CoTextArea: CoTextArea,
  },
})
export default class ContrastPanel extends Mixins(BaseView, WindowController) {
  getModifiedText() {
    return this.sharedResult.text;
  }

  onSelect(event: Event) {
    const target = event.target as any;
    console.log(
      target.value.substring(target.selectionStart, target.selectionEnd)
    );
  }

  get fontStyle() {
    return {
      fontSize: this.size.toString() + "px",
    };
  }

  get idx() {
    const idx = this.$refs.myhead;
    console.log(idx);
    return idx;
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
