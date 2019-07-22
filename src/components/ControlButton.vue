<template>
  <div class="ctrlBtn" v-on:contextmenu="switchListen">
    <el-button :style="styleNow" circle></el-button>
  </div>
</template>

<script>
import WindowController from "./WindowController";
import { MessageType, WinOpt } from "../tools/enums";
import { ipcRenderer as ipc } from "electron";

export default {
  name: "ControlButton",
  data: function() {
    return {
      colorNow: "white"
    };
  },
  computed: {
    styleNow() {
      return `background:${this.colorNow};`;
    }
  },
  methods: {
    switchColor(color) {
      this.colorNow = color;
    },
    switchListen() {
      this.$controller.action.callback("listenClipboard");
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
.ctrlBtn {
  position: absolute;
  bottom: 5px;
  right: 5px;
}
</style>
