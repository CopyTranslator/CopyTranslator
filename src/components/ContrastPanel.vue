<template>
  <div :style="maxParent">
    <Focus class="maxNoPad areaWarpper" v-if="layoutType === 'focus'"></Focus>
    <div
      v-else-if="layoutType === 'horizontal'"
      class="maxNoPad"
      style="margin: 0px; display: flex;"
    >
      <div
        class="areaWarpper"
        v-bind:style="leftStyle"
        @wheel="wheelHandler($event, 'source')"
        @keydown.ctrl.187="keyboardFontHandler($event, 'source')"
        @keydown.ctrl.189="keyboardFontHandler($event, 'source')"
      >
        <textarea
          v-bind:style="sourceFontStyle"
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
          @contextmenu="openMenu('contrastContext')"
        ></textarea>
      </div>
      <div
        id="hDrag"
        class="resizer"
        style="width: 4px; cursor: col-resize;"
        @mousedown="mousedown"
      ></div>
      <div
        class="areaWarpper"
        v-bind:style="rightStyle"
        @wheel="wheelHandler($event, 'result')"
        tabindex="-1"
        @keydown.ctrl.187="keyboardFontHandler($event, 'result')"
        @keydown.ctrl.189="keyboardFontHandler($event, 'result')"
      >
        <DiffTextArea v-if="multiSource" class="hArea"></DiffTextArea>
        <CoTextArea
          v-else-if="!config['contrastDict'] || !dictResult.valid"
          class="hArea"
          v-bind:style="resultFontStyle"
          :sentences="sharedResult.transPara"
          :chineseStyle="sharedResult.chineseStyle"
          ref="myhead"
        ></CoTextArea>
        <DictResultPanel
          v-else-if="config['contrastDict'] && dictResult.valid"
        ></DictResultPanel>
      </div>
    </div>
    <div v-else class="maxNoPad">
      <div
        :style="topStyle"
        class="areaWarpper"
        @wheel="wheelHandler($event, 'source')"
        @keydown.ctrl.187="keyboardFontHandler($event, 'source')"
        @keydown.ctrl.189="keyboardFontHandler($event, 'source')"
        @keyup.ctrl.13="translate"
        @contextmenu="openMenu('contrastContext')"
      >
        <textarea
          v-bind:style="sourceFontStyle"
          @keyup.ctrl.13="translate"
          @keyup.ctrl.71="google"
          @keyup.ctrl.66="baidu"
          @keyup.ctrl.80="command"
          class="vArea"
          v-model="sharedResult.text"
        ></textarea>
      </div>
      <div
        id="vDrag"
        class="resizer"
        style="height: 4px; cursor: row-resize;"
        @mousedown="vMousedown"
      ></div>
      <div
        :style="bottomStyle"
        class="areaWarpper"
        @wheel="wheelHandler($event, 'result')"
        @keydown.ctrl.187="keyboardFontHandler($event, 'result')"
        @keydown.ctrl.189="keyboardFontHandler($event, 'result')"
        tabindex="-1"
      >
        <DiffTextArea v-if="multiSource" class="vArea"></DiffTextArea>
        <CoTextArea
          class="vArea"
          v-else-if="!config['contrastDict'] || !dictResult.valid"
          v-bind:style="resultFontStyle"
          :sentences="sharedResult.transPara"
          :chineseStyle="sharedResult.chineseStyle"
          ref="myhead"
        ></CoTextArea>
        <DictResultPanel
          v-else-if="config['contrastDict'] && dictResult.valid"
        ></DictResultPanel>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import BaseView from "../components/BaseView.vue";
import { Mixins, Component } from "vue-property-decorator";
import Focus from "./Focus.vue";
import CoTextArea from "./CoTextArea.vue";
import DiffTextArea from "./DiffTextArea.vue";
import DictResultPanel from "./DictResult.vue";

@Component({
  components: {
    Focus,
    CoTextArea,
    DiffTextArea,
    DictResultPanel,
  },
})
export default class ContrastPanel extends Mixins(BaseView) {
  left: number = 0;
  top: number = 0;
  visible: boolean = false;
  funcID: any = null;
  selectedText: string = "";

  x: number = 0;
  y: number = 0;
  leftWidth: number = 0;
  fullWidth: number = 0;
  fullHeight: number = 0;
  leftHeight: number = 0;

  get ratio(): number {
    return this.layoutConfig.ratio;
  }

  set ratio(val: number) {
    this.updateLayoutConfig({ ratio: val });
  }

  mousedown(e: MouseEvent) {
    // Get the current mouse position
    this.x = e.clientX;
    // Attach the listeners to `document`
    const resizer = document.getElementById("hDrag") as any;
    const leftSide = resizer.previousElementSibling;
    const rightSide = resizer.nextElementSibling;
    leftSide.style.userSelect = "none";
    leftSide.style.pointerEvents = "none";
    rightSide.style.userSelect = "none";
    rightSide.style.pointerEvents = "none";
    this.fullWidth = resizer.parentNode.getBoundingClientRect().width;
    this.leftWidth = leftSide.getBoundingClientRect().width;
    document.addEventListener("mousemove", this.mouseMoveHandler);
    document.addEventListener("mouseup", this.mouseUpHandler);
  }

  mouseMoveHandler(e: MouseEvent) {
    // How far the mouse has been moved
    const dx = e.clientX - this.x;
    this.ratio = (this.leftWidth + 2 + dx) / this.fullWidth;
  }

  mouseUpHandler(e: MouseEvent) {
    const resizer = document.getElementById("hDrag") as any;
    const leftSide = resizer.previousElementSibling;
    const rightSide = resizer.nextElementSibling;

    leftSide.style.removeProperty("user-select");
    leftSide.style.removeProperty("pointer-events");

    rightSide.style.removeProperty("user-select");
    rightSide.style.removeProperty("pointer-events");

    // Remove the handlers of `mousemove` and `mouseup`
    document.removeEventListener("mousemove", this.mouseMoveHandler);
    document.removeEventListener("mouseup", this.mouseUpHandler);
  }

  vMousedown(e: MouseEvent) {
    // Get the current mouse position
    this.y = e.clientY;
    const resizer = document.getElementById("vDrag") as any;
    const leftSide = resizer.previousElementSibling;
    const rightSide = resizer.nextElementSibling;
    leftSide.style.userSelect = "none";
    leftSide.style.pointerEvents = "none";
    rightSide.style.userSelect = "none";
    rightSide.style.pointerEvents = "none";
    this.fullHeight = resizer.parentNode.getBoundingClientRect().height;
    this.leftHeight = leftSide.getBoundingClientRect().height;
    // Attach the listeners to `document`
    document.addEventListener("mousemove", this.vMouseMoveHandler);
    document.addEventListener("mouseup", this.vMouseUpHandler);
  }

  vMouseMoveHandler(e: MouseEvent) {
    // How far the mouse has been moved
    const dy = e.clientY - this.y;
    this.ratio = (this.leftHeight + 2 + dy) / this.fullHeight;
  }

  vMouseUpHandler(e: MouseEvent) {
    const resizer = document.getElementById("vDrag") as any;
    const leftSide = resizer.previousElementSibling;
    const rightSide = resizer.nextElementSibling;

    leftSide.style.removeProperty("user-select");
    leftSide.style.removeProperty("pointer-events");

    rightSide.style.removeProperty("user-select");
    rightSide.style.removeProperty("pointer-events");

    // Remove the handlers of `mousemove` and `mouseup`
    document.removeEventListener("mousemove", this.vMouseMoveHandler);
    document.removeEventListener("mouseup", this.vMouseUpHandler);
  }

  get leftStyle() {
    return {
      width: `calc(${this.ratio * 100}% - 2px)`,
    };
  }

  get rightStyle() {
    return {
      width: `calc(${(1 - this.ratio) * 100}% - 2px)`,
      "overscroll-behavior": "contain",
      overflow: "auto",
    };
  }

  get topStyle() {
    return {
      height: `calc(${this.ratio * 100}% - 2px)`,
    };
  }

  get bottomStyle() {
    return {
      height: `calc(${(1 - this.ratio) * 100}% - 2px)`,
      "overscroll-behavior": "contain",
      overflow: "auto",
    };
  }

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

  get sourceFontStyle() {
    return {
      fontSize: this.sourceSize.toString() + "px",
      height: "100%",
      overflow: "auto",
      color: this.fontColor,
    };
  }

  get resultFontStyle() {
    return {
      fontSize: this.resultSize.toString() + "px",
      height: "100%",
      color: this.fontColor,
    };
  }

  get idx() {
    const idx = this.$refs.myhead;
    console.log(idx);
    return idx;
  }

  get maxParent() {
    return {
      height: `calc(100vh - ${this.titlebarHeight})`,
      width: "100%",
      padding: "0px",
    };
  }
}
</script>
<style scoped>
.hArea {
  height: 100%;
  width: 100%;
  resize: none;
  padding: 0px;
  margin: 0px;
}
.vArea {
  width: 100%;
  resize: none;
  padding: 0px;
  margin: 0px;
}
.maxNoPad {
  height: 100%;
  width: 100%;
  padding: 0px;
  overflow: hidden;
}

.areaWarpper {
  padding: 0px;
  overflow: hidden;
}
.myswitch >>> .v-messages {
  min-height: 0px;
}

.floating-div {
  position: absolute;
  z-index: 100000;
}
.resizer {
  /* Doesn't allow to select the content inside */
  user-select: none;
  background-color: #bebebe;
}
</style>
