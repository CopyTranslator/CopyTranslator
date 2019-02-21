<template>
    <div :style="styleNow" v-on:dblclick="minify" v-on:mousedown="bindDrag"></div>
</template>

<script>
import WindowController from "./WindowController";
import { MessageType, WinOpt } from "../tools/enums";
import { ipcRenderer as ipc } from "electron";

export default {
  mixins: [WindowController],
  data: function() {
    return {
      colorNow: "white"
    };
  },
  computed: {
    styleNow() {
      return `height: 15px;background: ${this.colorNow};`;
    }
  },
  methods: {
    switchColor(color) {
      this.colorNow = color;
    }
  },
  mounted: function() {
    ipc.on(MessageType.WindowOpt.toString(), (event, arg) => {
      switch (arg.type) {
        case WinOpt.ChangeColor:
          this.switchColor(arg.args);
          break;
      }
    });
    this.$controller.setCurrentColor();
  }
};
</script>

<style scoped>
</style>
