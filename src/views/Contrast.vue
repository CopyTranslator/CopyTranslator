<template>
  <div>
    <v-app>
      <v-app-bar app color="purple" dark dense>
        <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
        <v-text-field
          solo-inverted
          flat
          hide-details
          label="Search in text"
        ></v-text-field>
        <v-spacer></v-spacer>
        <EngineButton
          v-for="engine in engines"
          :key="engine"
          :engine="engine"
          :valid="false"
        ></EngineButton>
      </v-app-bar>
      <v-navigation-drawer
        v-model="drawer"
        app
        disable-resize-watcher
        :permanent="drawer"
        hide-overlay
        :width="200"
      >
        <v-switch v-model="horizontal" label="Horizontal"></v-switch>
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
import { translatorTypes, TranslatorType } from "../tools/translate/constants";
import EngineButton from "../components/EngineButton.vue";

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
  readonly engines = translatorTypes;

  toSetting() {
    this.$proxy.handleAction("settings");
  }

  mounted() {
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
}
</script>
<style>
.active {
  margin-left: 200px;
}
::-webkit-scrollbar {
  display: none;
}
</style>
