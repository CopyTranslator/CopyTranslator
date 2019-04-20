<template>
  <div
    class="statusBar"
    :style="styleNow"
    v-on:dblclick="minify"
    v-on:contextmenu="switchListen"
    v-on:mousedown="startDrag"
  ></div>
</template>

<script>
import WindowController from "./WindowController";
import { MessageType, WinOpt } from "../tools/enums";
import { ipcRenderer as ipc } from "electron";
import { WindowWrapper } from "../tools/windows";

export default {
  mixins: [WindowController],
  data: function() {
    return {
      colorNow: "white"
    };
  },
  computed: {
    styleNow() {
      return `background: ${this.colorNow}; `;
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
        case WinOpt.EndDrag:
          this.endDrag();
          break;
      }
    });
    this.$controller.setCurrentColor();
  }
};
</script>

<style scoped>
.statusBar {
  width: 100%;
  height: 15px;
}
.dragButton {
  -webkit-app-region: drag;
}
</style>
