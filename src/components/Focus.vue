<template>
  <div
    @wheel="wheelHandler($event, 'result')"
    @keydown.ctrl.187="keyboardFontHandler($event, 'result')"
    @keydown.ctrl.189="keyboardFontHandler($event, 'result')"
  >
    <div
      class="max"
      @keyup.ctrl.13.capture="translate"
      @keyup.ctrl.71.capture="google"
      @keyup.ctrl.66.capture="baidu"
      @keyup.ctrl.80.capture="command"
      v-on:drop="dragTranslate"
    >
      <div
        v-if="(mode === 'normal'|| mode==='none')"
        style="height: 100%;"
        v-bind:style="focusStyle"
        @contextmenu="openMenu('focusContext')"
      >
        <div v-if="(config.focusSource && mode=='normal')">
          <div>原文：</div>
          <div class="focusText" id="focusSource" contenteditable="true">
            {{ sharedResult.text }}
          </div>
          <div>译文：</div>
          <div class="focusText" contenteditable="true">
            {{ sharedResult.translation }}
          </div>
        </div>
        <textarea
          v-else
          class="focusText max"
          v-model="sharedResult.translation"
          v-bind:style="focusStyle"
        ></textarea>
      </div>
      <DiffTextArea
        v-else-if="mode == 'diff'"
        class="focusText max"
        id="diffText"
      ></DiffTextArea>
      <DictResultPanel
        v-else-if="mode === 'dict'"
        id="dictResultPanel"
        class="max"
      ></DictResultPanel>
    </div>
    <div style="font-size: 15px; position: absolute; right: 0px; bottom: 5px;">
      <div
        v-if="
          status !== 'Translating' &&
          mode === 'normal' &&
          sharedResult.engine !== '' &&
          sharedResult.engine !== currentEngine
        "
      >
        <a>
          <span>
            {{ currentEngine }}&nbsp;{{ trans["fallbackPrompt1"]
            }}{{ sharedResult.engine }}{{ trans["fallbackPrompt2"] }}
          </span>
        </a>
      </div>
      <div v-else-if="currentEngine === 'keyan'">
        <a @click="toKeyan()">
          <span>来⾃棵岩翻译 免费⼀键翻译全⽂>>></span>
        </a>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import BaseView from "./BaseView.vue";
import DictResultPanel from "./DictResult.vue";
import { Mixins, Ref, Component } from "vue-property-decorator";
import DiffTextArea from "./DiffTextArea.vue";

@Component({
  components: {
    DictResultPanel,
    DiffTextArea,
  },
})
export default class FocusMode extends Mixins(BaseView) {
  dragTranslate(event: any) {
    console.log(event.dataTransfer.getData("text/plain"));
  }

  capture() {
    // this.$proxy.capture();
  }

  get focusStyle() {
    return {
      fontSize: this.resultSize.toString() + "px",
      color: this.fontColor,
    };
  }

  getTextById(id: string) {
    const e = document.getElementById(id) as HTMLElement;
    const text = e.innerText;
    return text;
  }

  getModifiedText() {
    let text: string | undefined;
    switch (this.mode) {
      case "diff":
        text = this.getTextById("diffText");
        break;
      case "dict":
        text = this.getTextById("dictResultPanel");
        break;
      case "normal":
        if (this.config.focusSource) {
          text = this.getTextById("focusSource");
        } else {
          text = this.sharedResult.translation;
        }
        break;
      case "none":
        text = text = this.sharedResult.translation;
        break;
    }
    if (text) {
      this.$forceUpdate();
    }
    return text;
  }
}
</script>

<style scoped>
.focusText {
  resize: none;
}
.max {
  height: 100%;
  width: 100%;
}
</style>
