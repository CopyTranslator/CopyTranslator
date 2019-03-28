<template>
  <div v-on:contextmenu="openMenu('Focus')" style="width:100vw;height:100vh;">
    <StatusBar ref="bar"></StatusBar>
    <div>
      <textarea
        class="focusText"
        @keyup.ctrl.13="shortcut"
        @keyup.ctrl.71="google"
        @keyup.ctrl.66="baidu"
        v-bind:style="focusStyle"
        v-model="sharedResult.result"
        v-if="sharedResult && !sharedResult.dict"
      ></textarea>
      <DictResult :size="size"></DictResult>
    </div>
  </div>
</template>

<script>
import StatusBar from "../components/StatusBar";
import BaseView from "../components/BaseView";
import WindowController from "../components/WindowController";
import Adjustable from "../components/Adjustable";
import DictResult from "../components/DictResult";
import { shell } from "electron";
import { RuleName } from "@/tools/rule";
export default {
  name: "FocusMode",
  mixins: [BaseView, WindowController, Adjustable],
  components: { DictResult, StatusBar },
  data: function() {
    return {
      size: this.$controller.get(RuleName.focus).fontSize,
      routeName: "focus"
    };
  },
  methods: {
    shortcut() {
      this.$controller.tryTranslate(this.sharedResult.result);
    },
    baidu() {
      shell.openExternal(
        `https://www.baidu.com/s?ie=utf-8&wd=${this.sharedResult.result}`
      );
    },
    google() {
      shell.openExternal(
        `https://www.google.com/search?q=${this.sharedResult.result}`
      );
    }
  },
  computed: {
    focusStyle() {
      return {
        fontSize: this.size.toString() + "px",
        width: "100%",
        height: (this.windowHeight - this.barHeight).toString() + "px"
      };
    }
  },
  mounted: function() {
    this.barHeight = this.$refs.bar.$el.clientHeight;
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped></style>
