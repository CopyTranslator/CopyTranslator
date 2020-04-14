<template>
  <div></div>
</template>

<script lang="ts">
import { MessageType, WinOpt } from "../common/enums";
import { ipcRenderer as ipc, webFrame } from "electron";
import { RouteActionType, MenuActionType, Identifier } from "../common/types";
import Vue from "vue";
import Component, { mixins } from "vue-class-component";

@Component
export default class WindowController extends Vue {
  routeName: RouteActionType | null = null;
  windowHeight: number = window.innerHeight;
  windowWidth: number = window.innerWidth;

  windowOpt(type: WinOpt, args: any = null) {
    ipc.send(MessageType.WindowOpt.toString(), {
      type: type,
      args: args
    });
  }

  callback(cmd: string) {
    this.$controller.action.callback(cmd);
  }

  minify(event: any) {
    this.windowOpt(WinOpt.Minify);
  }

  closeMe() {
    this.windowOpt(WinOpt.CloseMe);
  }

  openMenu(id: MenuActionType) {
    // this.$proxy.popup(id);
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
