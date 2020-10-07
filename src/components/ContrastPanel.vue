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
          @keyup.ctrl.80="command"
          @select="onSelect"
          @blur="deSelect"
          @click="deSelect"
          @keydown="deSelect"
          @mousemove="mouseMove"
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
      </v-col>
    </v-row>
    <v-col v-else class="maxNoPad">
      <div class="areaWarpper" style="height: 50%;" @keyup.ctrl.13="translate">
        <textarea
          v-bind:style="fontStyle"
          @keyup.ctrl.13="translate"
          @keyup.ctrl.71="google"
          @keyup.ctrl.66="baidu"
          @keyup.ctrl.80="command"
          class="vArea"
          v-model="sharedResult.text"
          v-on:contextmenu="openMenu('contrastContext')"
        ></textarea>
      </div>
      <div class="areaWarpper" style="height: 50%;">
        <CoTextArea
          class="vArea"
          v-bind:style="fontStyle"
          :sentences="sharedResult.transPara"
          ref="myhead"
        ></CoTextArea>
      </div>
    </v-col>

    <v-btn
      class="floating-div"
      v-bind:style="floatingStyle"
      small
      fab
      @mouseenter="mouseEnter"
      @mouseleave="mouseLeave"
      ><v-icon>mdi-magnify</v-icon></v-btn
    >
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
  left: number = 0;
  top: number = 0;
  visible: boolean = false;
  funcID: any = null;
  selectedText: string = "";

  getModifiedText() {
    return this.sharedResult.text;
  }

  onSelect(event: Event) {
    const target = event.target as any;
    const selectedText = target.value.substring(
      target.selectionStart,
      target.selectionEnd
    );
    this.selectedText = selectedText;
    this.visible = true;
  }

  deSelect(event: Event) {
    this.visible = false;
  }

  mouseMove(event: MouseEvent) {
    if (!this.visible) {
      this.left = event.clientX + 10;
      this.top = event.clientY - 50;
    }
  }

  mouseEnter(event: MouseEvent) {
    this.funcID = setTimeout(this.onSearch, 500);
  }

  mouseLeave(event: MouseEvent) {
    if (this.funcID != null) {
      clearTimeout(this.funcID);
      this.funcID = null;
    }
  }

  onSearch() {
    this.callback("selectionQuery", this.selectedText);
    this.funcID = null;
  }

  get floatingStyle() {
    return {
      left: this.left.toString() + "px",
      top: this.top.toString() + "px",
      display: "none",
      //display: this.visible ? "block" : "none", //这里先
    };
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

.floating-div {
  position: absolute;
  z-index: 100000;
}
</style>
