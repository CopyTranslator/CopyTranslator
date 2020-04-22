<template>
  <div>
    <div
      class="max"
      @keyup.alt.13="toggleCmdline"
      @keyup.ctrl.13="translate"
      @keyup.ctrl.71="google"
      @keyup.ctrl.66="baidu"
      v-on:contextmenu="openMenu('focusContext')"
      v-on:drop="dragTranslate"
    >
      <textarea
        ref="normalResult"
        class="focusText max"
        v-bind:style="focusStyle"
        v-model="sharedResult.translation"
        v-if="sharedResult && !dictResult.valid"
      ></textarea>
      <DictResultPanel
        v-if="dictResult.valid"
        ref="dictResultPanel"
        class="max"
      ></DictResultPanel>
    </div>
  </div>
</template>

<script lang="ts">
import { shell } from "electron";
import BaseView from "./BaseView.vue";
import WindowController from "./WindowController.vue";
import DictResultPanel from "./DictResult.vue";
import { Mixins, Ref, Component } from "vue-property-decorator";
import { Identifier, RouteActionType } from "../common/types";
import eventBus from "../common/event-bus";

@Component({
  components: {
    DictResultPanel
  }
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
      fontSize: this.size.toString() + "px"
    };
  }

  getModifiedText() {
    if (this.sharedResult && !this.dictResult.valid) {
      return this.sharedResult.translation;
    } else {
      //@ts-ignore
      return (this.dictResultPanel[0].$el as any).innerText;
    }
  }

  baidu() {
    shell.openExternal(
      `https://www.baidu.com/s?ie=utf-8&wd=${this.getModifiedText()}`
    );
  }

  google() {
    shell.openExternal(
      `https://www.google.com/search?q=${this.getModifiedText()}`
    );
  }

  translate() {
    const text = this.getModifiedText();
    eventBus.at("dispatch", "translate", text);
    this.$store.dispatch("clearShared");
    this.$store.dispatch("setDictResult", {
      valid: false
    });
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
