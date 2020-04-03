<template>
  <div style="width:100vw;height:100vh;">
    <div
      style="height:100%;width:100%"
      @keyup.alt.13="toggleCmdline"
      @keyup.ctrl.13="shortcut"
      @keyup.ctrl.71="google"
      @keyup.ctrl.66="baidu"
      v-on:contextmenu="openMenu('focusContext')"
      v-on:drop="log2"
    >
      <v-row style="width:100%;height:100%;margin:0px;">
        <v-col
          style="height:100%;padding:0px;"
          v-for="engine in activeEngines"
          :key="engine"
        >
          <textarea
            ref="normalResult"
            class="focusText"
            v-bind:style="focusStyle"
            v-model="sharedResult.result"
            v-if="sharedResult && !dictResult.valid"
          ></textarea>
          <DictResultPanel
            v-if="dictResult.valid"
            ref="dictResultPanel"
            :size="size"
          ></DictResultPanel>
        </v-col>
      </v-row>
    </div>
    <v-text-field
      v-if="isOpen"
      @keyup.enter.native="exectueCmd"
      style="width:100%;"
      v-model="cmd"
    ></v-text-field>
    <ControlButton :valid="dictResult.valid"></ControlButton>
  </div>
</template>

<script lang="ts">
import { shell } from "electron";
import BaseView from "../components/BaseView.vue";
import WindowController from "../components/WindowController.vue";
import DictResultPanel from "../components/DictResult.vue";
import ControlButton from "../components/ControlButton.vue";
import { Mixins, Ref, Component } from "vue-property-decorator";
import { Identifier, RouteActionType } from "../tools/types";

@Component({
  components: {
    DictResultPanel,
    ControlButton
  }
})
export default class FocusMode extends Mixins(BaseView, WindowController) {
  routeName: RouteActionType = "focus";
  cmd: string = "";
  activeEngines: any[] = ["Baidu"];
  isOpen: boolean = false;
  @Ref("dictResultPanel") readonly dictResultPanel!: DictResultPanel;

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
  shortcut() {
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

<style scoped></style>
