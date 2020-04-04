<template>
  <div>
    <v-app>
      <v-app-bar app color="purple" dark dense>
        <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
        <v-spacer></v-spacer>
        <EngineButton
          v-for="engine in engines"
          :key="engine"
          :engine="engine"
          :valid="valid"
        ></EngineButton>
        <v-btn
          v-bind:class="['switchBtn', 'btnBase']"
          fab
          x-small
          @click="resultOnly = !resultOnly"
          v-on:contextmenu="horizontal = !horizontal"
        ></v-btn>
        <div v-on:dblclick="minify" v-on:contextmenu="openMenu('focusRight')">
          <v-btn :style="styleNow" @click="switchListen" fab x-small></v-btn>
        </div>
      </v-app-bar>
      <v-navigation-drawer
        v-model="drawer"
        app
        disable-resize-watcher
        :permanent="drawer"
        hide-overlay
        :width="200"
      >
        <Action
          v-for="actionId in actionKeys"
          :identifier="actionId"
          :key="actionId"
        ></Action>
      </v-navigation-drawer>
      <ContrastPanel
        :style="area"
        v-bind:class="{ active: drawer }"
      ></ContrastPanel>
    </v-app>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import ContrastPanel from "../components/ContrastPanel.vue";
import BaseView from "../components/BaseView.vue";
import WindowController from "../components/WindowController.vue";
import Action from "../components/Action.vue";
import Component from "vue-class-component";
import { Mixins, Watch } from "vue-property-decorator";
import { Identifier } from "../tools/types";
import { ipcRenderer as ipc } from "electron";
import EngineButton from "../components/EngineButton.vue";
import { translatorTypes, TranslatorType } from "../tools/translate/constants";
import { MessageType, WinOpt } from "../tools/enums";
import {
  dictionaryTypes,
  DictionaryType,
  CopyDictResult
} from "../tools/dictionary/types";

@Component({
  components: {
    Action: Action,
    ContrastPanel: ContrastPanel,
    EngineButton: EngineButton
  }
})
export default class Contrast extends Mixins(BaseView, WindowController) {
  barWidth: number = 0;
  size: number = 15;
  readonly routeName = "contrast";
  actionKeys: Identifier[] = [];
  colorNow: string = "white";

  get valid() {
    return this.dictResult.valid && this.resultOnly;
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

  toSetting() {
    this.$proxy.handleAction("settings");
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
    this.$proxy.get("contrast").then(res => {
      this.size = res.fontSize;
    });
    this.$proxy.getKeys("contrastPanel").then(res => {
      this.actionKeys = res;
    });
  }

  @Watch("drawer")
  changeDrawer(val: boolean) {
    if (val) {
      this.barWidth = 200;
    } else {
      this.barWidth = 0;
    }
  }

  get area() {
    return {
      "margin-top": "49px",
      width: `${(this.windowWidth - this.barWidth).toString()}px`
    };
  }

  get drawer(): boolean {
    return this.$store.state.drawer;
  }

  set drawer(val: boolean) {
    this.$store.commit("switchDrawer", val);
  }

  get horizontal() {
    return this.$store.state.horizontal;
  }
  set horizontal(val) {
    this.$store.commit("switchHorizontal", val);
  }

  get resultOnly() {
    return this.$store.state.resultOnly;
  }

  set resultOnly(val) {
    this.$store.commit("switchResultOnly", val);
  }
}
</script>
<style>
.active {
  margin-left: 200px;
}
::-webkit-scrollbar {
  display: none;
}
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
