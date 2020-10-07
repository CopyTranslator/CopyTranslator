<template>
  <div>
    <v-app>
      <v-app-bar app color="#8E24AA" dark dense height="40px">
        <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
        <v-spacer style="height: 100%; width: 100%;">
          <div
            style="
              -webkit-app-region: drag;
              height: 100%;
              width: 100%;
              font-family: 'Encode Sans', sans-serif;
            "
          ></div>
        </v-spacer>
        <v-menu top>
          <template v-slot:activator="{ on }">
            <div v-on="on" v-on:contextmenu="callback('listenClipboard')">
              <v-badge dot :color="color" offset-y="pl/ml-5" offset-x="pl/ml-1">
                <EngineButton
                  :engine="currentEngine"
                  :valid="valid"
                  :enable="Boolean(false)"
                ></EngineButton>
              </v-badge>
            </div>
          </template>

          <v-list>
            <v-list-item v-for="engine in rest_engines" :key="engine">
              <EngineButton :engine="engine" :valid="valid"></EngineButton>
            </v-list-item>
          </v-list>
        </v-menu>

        <v-btn @click="enumerateLayouts" fab small depressed color="#8E24AA">
          <v-icon>mdi-view-quilt</v-icon>
        </v-btn>
        <v-btn
          color="#8E24AA"
          small
          depressed
          fab
          @click="callback('copyResult')"
          v-on:contextmenu="callback('copySource')"
          ><v-icon>mdi-content-copy</v-icon></v-btn
        >
        <v-btn
          color="#8E24AA"
          small
          depressed
          fab
          @click="callback('minimize')"
          @contextmenu="close"
          ><v-icon>mdi-window-minimize</v-icon></v-btn
        >
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
import {
  Identifier,
  layoutTypes,
  LayoutType,
  translatorTypes,
  TranslatorType,
} from "../common/types";
import { ipcRenderer as ipc } from "electron";
import EngineButton from "../components/EngineButton.vue";

import {
  dictionaryTypes,
  DictionaryType,
  emptyDictResult,
} from "../common/dictionary/types";

@Component({
  components: {
    Action: Action,
    ContrastPanel: ContrastPanel,
    EngineButton: EngineButton,
  },
})
export default class Contrast extends Mixins(BaseView, WindowController) {
  barWidth: number = 0;
  readonly routeName = "contrast";
  actionKeys: Identifier[] = this.$controller.action.getKeys("contrastPanel");

  get valid() {
    return this.dictResult.valid && this.layoutType === "focus";
  }

  get engines() {
    return this.valid ? dictionaryTypes : this.config["translator-auto"];
  }

  get rest_engines() {
    return this.engines.filter(
      (engine: string) => engine != this.currentEngine
    );
  }

  get currentEngine() {
    if (!this.valid) {
      return this.$store.state.config.translatorType;
    } else {
      return this.$store.state.config.dictionaryType;
    }
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
      "margin-top": "40px",
      width: `${(this.windowWidth - this.barWidth).toString()}px`,
    };
  }

  get drawer(): boolean {
    return this.config.drawer;
  }

  set drawer(val: boolean) {
    this.set("drawer", val);
  }

  enumerateLayouts() {
    const index = layoutTypes.findIndex((x) => x === this.layoutType);
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
