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
        <div v-on:dblclick="minify" v-on:contextmenu="openMenu('focusRight')">
          <v-btn
            :style="styleNow"
            @click="callback('listenClipboard')"
            fab
            x-small
          ></v-btn>
        </div>
        <v-btn @click="enumerateLayouts" fab small depressed color="purple">
          <v-icon>mdi-view-quilt</v-icon>
        </v-btn>
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
import { Identifier, layoutTypes, LayoutType } from "../common/types";
import { ipcRenderer as ipc } from "electron";
import EngineButton from "../components/EngineButton.vue";
import { translatorTypes, TranslatorType } from "../common/translate/constants";

import {
  dictionaryTypes,
  DictionaryType,
  CopyDictResult
} from "../common/dictionary/types";

@Component({
  components: {
    Action: Action,
    ContrastPanel: ContrastPanel,
    EngineButton: EngineButton
  }
})
export default class Contrast extends Mixins(BaseView, WindowController) {
  barWidth: number = 0;
  readonly routeName = "contrast";
  actionKeys: Identifier[] = this.$controller.action.getKeys("contrastPanel");

  get valid() {
    return this.dictResult.valid && this.layoutType === "focus";
  }

  get engines() {
    return this.valid ? dictionaryTypes : translatorTypes;
  }

  get styleNow() {
    return `background:${this.color};`;
  }

  get color() {
    return this.$store.state.color;
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
    return this.config.drawer;
  }

  set drawer(val: boolean) {
    this.set("drawer", val);
  }

  enumerateLayouts() {
    const index = layoutTypes.findIndex(x => x === this.layoutType);
    this.set("layoutType", layoutTypes[(index + 1) % layoutTypes.length]);
  }

  get layoutType() {
    return this.config.layoutType;
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
