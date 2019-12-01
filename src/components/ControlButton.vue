<template>
  <div class="ctrlBtn">
    <el-row>
      <el-col :span="span" :offset="start">
        <div>
          <el-button
            v-bind:class="['switchBtn', 'btnBase']"
            circle
            @click="callback('contrast')"
          ></el-button>
        </div>
      </el-col>
      <el-col :span="span">
        <div v-on:contextmenu="callback('copySource')">
          <el-button
            v-bind:class="['copyBtn', 'btnBase']"
            circle
            @click="callback('copyResult')"
          ></el-button>
        </div>
      </el-col>
      <el-col v-for="engine in engines" :key="engine" :span="span" :offset="0">
        <EngineButton :engine="engine"></EngineButton>
      </el-col>
      <el-col :span="span">
        <div v-on:dblclick="minify" v-on:contextmenu="openMenu('focusRight')">
          <el-button :style="styleNow" @click="switchListen" circle></el-button>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script lang="ts">
import WindowController from "./WindowController.vue";
import EngineButton from "./EngineButton.vue";
import { MessageType, WinOpt } from "../tools/enums";
import { ipcRenderer as ipc } from "electron";
import { translatorTypes } from "../tools/translate";
import { Vue, Component, Mixins } from "vue-property-decorator";

@Component({
  components: {
    EngineButton
  }
})
export default class ControlButton extends Mixins(WindowController) {
  start: number = 12;
  span: number = 3;
  colorNow: string = "white";
  engines = translatorTypes;
  components = { EngineButton };

  get styleNow() {
    return `background:${this.colorNow};`;
  }

  switchColor(color: string) {
    this.colorNow = color;
  }

  switchListen() {
    this.$proxy.handleAction("listenClipboard");
  }

  mounted() {
    ipc.on(MessageType.WindowOpt.toString(), (event, arg) => {
      switch (arg.type) {
        case WinOpt.ChangeColor:
          this.switchColor(arg.args);
          break;
      }
    });
    this.$proxy.setCurrentColor();
    this.start = this.start - this.span * (this.engines.length - 1);
  }
}
</script>

<style scoped>
.ctrlBtn {
  position: absolute;
  bottom: 5px;
  right: 5px;
  width: 220px;
}
.btnBase {
  background-position: center;
  background-size: contain;
}
.copyBtn {
  background-image: url("../images/copy.png");
}
.switchBtn {
  background-image: url("../images/switch.png");
}
</style>
