<template>
  <div style="width:100%;height:100%;">
    <div
      style="height:100%"
      @keyup.alt.13="toggleCmdline"
      @keyup.ctrl.13="shortcut"
      @keyup.ctrl.71="google"
      @keyup.ctrl.66="baidu"
      v-on:contextmenu="openMenu('FocusText')"
      v-on:drop="log2"
    >
      <el-row style="width:100%;height:100vh">
        <el-col
          style="height:100%"
          v-for="engine in activeEngines"
          :key="engine"
          :span="24 / activeEngines.length"
        >
          <textarea
            ref="normalResult"
            class="focusText"
            v-bind:style="focusStyle"
            v-model="sharedResult.result"
            v-if="sharedResult && !sharedResult.dict"
          ></textarea>

          <DictResult
            v-if="sharedResult && sharedResult.dict"
            ref="dictResult"
            :size="size"
          ></DictResult>
        </el-col>
      </el-row>
    </div>
    <el-input
      v-if="isOpen"
      @keyup.enter.native="exectueCmd"
      style="width:100%;"
      v-model="cmd"
    ></el-input>
    <ControlButton></ControlButton>
  </div>
</template>

<script lang="ts">
import { shell } from "electron";
import BaseView from "../components/BaseView.vue";
import WindowController from "../components/WindowController.vue";
import DictResult from "../components/DictResult.vue";
import ControlButton from "../components/ControlButton.vue";
import { Mixins, Ref, Component } from "vue-property-decorator";
import { Identifier } from "../tools/identifier";

@Component({
  components: {
    DictResult,
    ControlButton
  }
})
export default class FocusMode extends Mixins(BaseView, WindowController) {
  size: number = 15;
  routeName: Identifier = "focus";
  cmd: string = "";
  activeEngines: any[] = ["Baidu"];
  isOpen: boolean = false;
  @Ref("dictResult") readonly dictResult!: DictResult;

  mounted() {
    this.$proxy.get("focus").then(res => {
      this.size = res.fontSize;
    });
  }

  toggleCmdline() {
    this.isOpen = !this.isOpen;
  }
  log2(event: any) {
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
      fontSize: this.size.toString() + "px",
      width: "100%",
      height: "100vh"
    };
  }
  getModifiedText() {
    if (this.sharedResult && !this.sharedResult.dict) {
      return this.sharedResult.result;
    } else {
      return (this.dictResult.$el as any).innerText;
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
  shortcut() {
    const text = this.getModifiedText();
    const arg = {
      src: "",
      result: "",
      source: "",
      target: "",
      engine: "",
      dict: undefined,
      phonetic: undefined,
      notify: false
    };
    this.$store.commit("setShared", arg);
    this.$proxy.tryTranslate(text, true);
  }
}
</script>

<style scoped></style>
