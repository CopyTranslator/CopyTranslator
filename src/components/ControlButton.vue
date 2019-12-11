<template>
  <div class="ctrlBtn">
    <el-row style="width">
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
      <el-col v-for="engine in engines" :key="engine" :span="span">
        <EngineButton :engine="engine" :valid="valid"></EngineButton>
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
import { Vue, Component, Mixins } from "vue-property-decorator";
import { translatorTypes, TranslatorType } from "../tools/translate/constants";
import {
  dictionaryTypes,
  DictionaryType,
  CopyDictResult
} from "../tools/dictionary/types";

const AppProps = Vue.extend({
  props: { valid: Boolean },
  components: {
    EngineButton
  }
});
@Component
export default class ControlButton extends Mixins(WindowController, AppProps) {
  span: number = 2;
  colorNow: string = "white";
  components = { EngineButton };

  get start() {
    return this.valid ? 12 : 6;
  }

  get engines() {
    return this.valid ? dictionaryTypes : translatorTypes;
  }
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
  }
}
</script>

<style scoped>
.ctrlBtn {
  position: absolute;
  bottom: 5px;
  right: 5px;
  width: 300px;
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
