<template>
  <div class="statusBar" :style="styleNow">
    <el-row style="height:100%;width:100%">
      <el-col
        :span="20"
        style="width:100%; -webkit-app-region: drag; background: #d3dce6"
      ></el-col>
      <el-col :span="4"><div style="width:100%;background:blue;"></div></el-col>
    </el-row>
  </div>
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
      return `height: 15px;`;
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
          console.log(Color.fromHex(arg.args));
          this.$titlebar.updateBackground(Color.fromHex(arg.args));
          break;
      }
    });
    this.$controller.setCurrentColor();
  }
};
</script>

<style scoped>
.statusBar {
}
</style>
