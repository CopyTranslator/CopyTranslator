<template>
  <div style="width:100%;height:100vh;">
    <div
      style="height:100%"
      @keyup.ctrl.13="shortcut"
      @keyup.ctrl.71="google"
      @keyup.ctrl.66="baidu"
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
    </div>
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
import { constants } from "crypto";
import ControlButton from "../components/ControlButton";

export default {
  name: "FocusMode",
  mixins: [BaseView, WindowController, Adjustable],
  components: { DictResult, ControlButton },
  data: function() {
    return {
      size: this.$controller.get(RuleName.focus).fontSize,
      routeName: "focus"
    };
  },
  methods: {
    shortcut() {
      const text = this.getModifiedText();
      const arg = {
        src: "",
        result: "",
        source: "",
        target: "",
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
