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
        v-model="sharedResult.result"
        v-if="sharedResult && !dictResult.valid"
      ></textarea>
      <DictResultPanel
        v-if="dictResult.valid"
        ref="dictResultPanel"
        :size="size"
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
import { Identifier, RouteActionType } from "../tools/types";

@Component({
  components: {
    DictResultPanel
  }
})
export default class FocusMode extends Mixins(BaseView, WindowController) {
  cmd: string = "";
  activeEngines: any[] = ["Baidu"];
  isOpen: boolean = false;
  @Ref("dictResultPanel") readonly dictResultPanel!: DictResultPanel;

  mounted() {}

  toggleCmdline() {
    this.isOpen = !this.isOpen;
  }

  dragTranslate(event: any) {
    console.log(event.dataTransfer.getData("text/plain"));
  }

  exectueCmd() {
    this.callback(this.cmd);
  }

  capture() {
    this.$proxy.capture();
  }

  get focusStyle() {
    return {
      fontSize: this.size.toString() + "px"
    };
  }
  getModifiedText() {
    if (this.sharedResult && !this.dictResult.valid) {
      return this.sharedResult.result;
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
    const arg = {
      src: "",
      result: "",
      source: "",
      target: "",
      engine: "",
      notify: false
    };
    this.$store.commit("setShared", arg);
    this.$store.commit("setDictResult", {
      valid: false
    });
    this.$proxy.tryTranslate(text, true);
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
