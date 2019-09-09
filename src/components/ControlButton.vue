<template>
  <div class="ctrlBtn">
    <el-row>
      <el-col
        v-for="(engine, index) in engines"
        :key="engine"
        :span="span"
        :offset="index == 0 ? start : 0"
      >
        <EngineButton :engine="engine" :idx="index"></EngineButton>
      </el-col>
      <el-col :span="span">
        <div v-on:dblclick="minify" v-on:contextmenu="openMenu('Focus')">
          <el-button :style="styleNow" @click="switchListen" circle></el-button>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import WindowController from "./WindowController";
import { MessageType, WinOpt } from "../tools/enums";
import { ipcRenderer as ipc } from "electron";
import EngineButton from "./EngineButton";
import { translatorNames } from "../tools/translators";

export default {
  name: "ControlButton",
  mixins: [WindowController],
  data: function() {
    return {
      start: 18,
      span: 3,
      colorNow: "white",
      engines: translatorNames
    };
  },
  components: { EngineButton },
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
    this.start = this.start - this.span * (this.engines.length - 1);
  }
};
</script>

<style scoped>
.ctrlBtn {
  position: absolute;
  bottom: 5px;
  right: 5px;
  width: 220px;
}
</style>
