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

<script>
import { desktopCapturer, screen, ipcRenderer } from "electron";
import BaseView from "../components/BaseView";
import WindowController from "../components/WindowController";
import Adjustable from "../components/Adjustable";
import DictResult from "../components/DictResult";
import { shell } from "electron";
import { RuleName } from "@/tools/rule";
import ControlButton from "../components/ControlButton";

export default {
  name: "FocusMode",
  mixins: [BaseView, WindowController, Adjustable],
  components: { DictResult, ControlButton },
  data: function() {
    return {
      size: this.$controller.get("focus").fontSize,
      routeName: "focus",
      cmd: "",
      activeEngines: ["Baidu"],
      isOpen: false
    };
  },
  methods: {
    toggleCmdline() {
      this.isOpen = !this.isOpen;
    },
    log2(event) {
      console.log(event.dataTransfer.getData("text/plain"));
    },
    exectueCmd() {
      console.log(this.cmd);
      this.callback(this.cmd);
    },
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
      this.$controller.tryTranslate(text);
    },
    getModifiedText() {
      if (this.sharedResult && !this.sharedResult.dict) {
        return this.sharedResult.result;
      } else {
        return this.$refs.dictResult.$el.innerText;
      }
    },
    capture() {
      this.$controller.capture();
    },
    baidu() {
      shell.openExternal(
        `https://www.baidu.com/s?ie=utf-8&wd=${this.getModifiedText()}`
      );
    },
    google() {
      shell.openExternal(
        `https://www.google.com/search?q=${this.getModifiedText()}`
      );
    }
  },
  computed: {
    focusStyle() {
      return {
        fontSize: this.size.toString() + "px",
        width: "100%",
        height: "100vh"
      };
    }
  }
};
</script>

<style scoped></style>
