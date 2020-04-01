<template>
  <div>
    <v-app>
      <v-app-bar app color="purple" dark>
        <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
        <v-text-field
          solo-inverted
          flat
          hide-details
          label="Search in text"
        ></v-text-field>
        <v-spacer></v-spacer>
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

@Component({
  components: {
    Action: Action,
    ContrastPanel: ContrastPanel
  }
})
export default class Contrast extends Mixins(BaseView, WindowController) {
  barWidth: number = 200;
  size: number = 15;
  readonly routeName = "contrast";
  actionKeys: Identifier[] = [];

  toSetting() {
    this.$proxy.handleAction("settings");
  }
  translate() {
    this.$proxy.tryTranslate(this.sharedResult.src, true);
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
      "margin-top": "64px",
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
