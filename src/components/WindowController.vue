<template>
  <div></div>
</template>

<script lang="ts">
import { ipcRenderer as ipc, webFrame } from "electron";
import { RouteActionType, MenuActionType, Identifier } from "../common/types";
import Vue from "vue";
import Component, { mixins } from "vue-class-component";
import bus from "../common/event-bus";

@Component
export default class WindowController extends Vue {
  routeName: RouteActionType | null = null;
  windowHeight: number = window.innerHeight;
  windowWidth: number = window.innerWidth;

  callback(cmd: string) {
    // bus.gat(cmd as any);
    console.log(cmd);
  }

  close() {
    bus.iat("closeWindow");
  }

  minify() {
    bus.iat("minify");
  }

  openMenu(id: MenuActionType) {
    bus.at("openMenu", id);
    console.log(id);
  }

  async onResize() {
    this.windowHeight = window.innerHeight;
    this.windowWidth = window.innerWidth;
  }

  mounted() {
    window.addEventListener("resize", this.onResize);
  }

  destroyed() {
    window.removeEventListener("resize", this.onResize);
    this.onResize();
  }
}
</script>
