<template>
  <div class="ctrlBtn">
    <v-row class="flex-nowrap">
      <v-col class="noPad">
        <div>
          <v-btn
            v-bind:class="['switchBtn', 'btnBase']"
            fab
            x-small
            @click="callback('contrast')"
          ></v-btn>
        </div>
      </v-col>
      <v-col class="noPad">
        <div v-on:contextmenu="callback('copySource')">
          <v-btn
            v-bind:class="['copyBtn', 'btnBase']"
            fab
            x-small
            @click="callback('copyResult')"
          ></v-btn>
        </div>
      </v-col>
      <v-col v-for="engine in engines" :key="engine" class="noPad">
        <EngineButton :engine="engine" :valid="valid"></EngineButton>
      </v-col>
      <v-col class="noPad">
        <div v-on:dblclick="minify" v-on:contextmenu="openMenu('focusRight')">
          <v-btn :style="styleNow" @click="switchListen" fab x-small></v-btn>
        </div>
      </v-col>
    </v-row>
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
  colorNow: string = "white";
  components = { EngineButton };
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
.noPad {
  padding: 0px;
}
.copyBtn {
  background-image: url("../images/copy.png");
}
.switchBtn {
  background-image: url("../images/switch.png");
}
</style>
