<template>
  <div
    contenteditable="true"
    @wheel="wheelHandler($event, 'result')"
    @keydown.ctrl.187="keyboardFontHandler($event, 'result')"
    @keydown.ctrl.189="keyboardFontHandler($event, 'result')"
  >
    <div
      class="max"
      @keyup.ctrl.13="translate"
      @keyup.ctrl.71="google"
      @keyup.ctrl.66="baidu"
      @keyup.ctrl.80="command"
      @contextmenu="openMenu('focusContext')"
      v-on:drop="dragTranslate"
    >
      <textarea
        ref="normalResult"
        class="focusText max text--primary"
        v-bind:style="focusStyle"
        v-model="sharedResult.translation"
        v-if="sharedResult && !dictResult.valid && !multiSource"
      ></textarea>
      <DiffTextArea
        v-if="sharedResult && !dictResult.valid && multiSource"
        class="focusText max"
        :allParts="sharedDiff.allParts"
        ref="diffText"
      ></DiffTextArea>
      <DictResultPanel
        v-if="dictResult.valid && config['smartDict']"
        ref="dictResultPanel"
        class="max"
      ></DictResultPanel>
    </div>
    <div style="font-size: 15px; position: absolute; right: 0px; bottom: 5px;">
      <div
        v-if="
          sharedResult.engine !== '' &&
          sharedResult.engine !== currentEngine &&
          !multiSource &&
          !dictResult.valid
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
  @Ref("dictResultPanel") readonly dictResultPanel!: DictResultPanel;

  dragTranslate(event: any) {
    console.log(event.dataTransfer.getData("text/plain"));
  }

  capture() {
    // this.$proxy.capture();
  }

  get focusStyle() {
    return {
      fontSize: this.resultSize.toString() + "px",
    };
  }

  getModifiedText() {
    if (this.sharedResult && !this.dictResult.valid) {
      if (this.multiSource) {
        //@ts-ignore
        return (this.diffText[0].$el as any).innerText;
      } else {
        return this.sharedResult.translation;
      }
    } else {
      //@ts-ignore
      return (this.dictResultPanel[0].$el as any).innerText;
    }
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
