<template>
  <div>
    <div
      class="max"
      @keyup.ctrl.13="translate"
      @keyup.ctrl.71="google"
      @keyup.ctrl.66="baidu"
      @keyup.ctrl.80="command"
      v-on:contextmenu="openMenu('focusContext')"
      v-on:drop="dragTranslate"
    >
      <textarea
        ref="normalResult"
        class="focusText max"
        v-bind:style="focusStyle"
        v-model="sharedResult.translation"
        v-if="sharedResult && !dictResult.valid && !multiSource"
      ></textarea>
      <DiffTextArea
        contenteditable="true"
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
  </div>
</template>

<script lang="ts">
import BaseView from "./BaseView.vue";
import WindowController from "./WindowController.vue";
import DictResultPanel from "./DictResult.vue";
import { Mixins, Ref, Component } from "vue-property-decorator";
import { Identifier, RouteActionType } from "../common/types";
import eventBus from "../common/event-bus";
import DiffTextArea from "./DiffTextArea.vue";
@Component({
  components: {
    DictResultPanel,
    DiffTextArea,
  },
})
export default class FocusMode extends Mixins(BaseView, WindowController) {
  @Ref("dictResultPanel") readonly dictResultPanel!: DictResultPanel;

  dragTranslate(event: any) {
    console.log(event.dataTransfer.getData("text/plain"));
  }

  capture() {
    // this.$proxy.capture();
  }

  get focusStyle() {
    return {
      fontSize: this.size.toString() + "px",
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
  border: solid 1px #bebebe;
}
.max {
  height: 100%;
  width: 100%;
}
</style>
