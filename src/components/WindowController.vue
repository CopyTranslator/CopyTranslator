<template>
  <div></div>
</template>

<script lang="ts">
import { MessageType, WinOpt } from "../tools/enums";
import { ipcRenderer as ipc, webFrame } from "electron";
import { RouteActionType, MenuActionType, Identifier } from "../tools/types";
import Vue from "vue";
import Component, { mixins } from "vue-class-component";

@Component
export default class WindowController extends Vue {
  routeName: RouteActionType | null = null;
  size: number = 20;
  windowHeight: number = window.innerHeight;
  windowWidth: number = window.innerWidth;

  setZoomFactor(value: number) {
    this.size -= value;
  }

  windowOpt(type: WinOpt, args: any = null) {
    ipc.send(MessageType.WindowOpt.toString(), {
      type: type,
      args: args
    });
  }

  callback(cmd: string) {
    this.$proxy.handleAction(cmd);
  }

  changeMode(routerName: RouteActionType) {
    this.$proxy.routeTo(routerName);
  }
  changeModeNoSave(routerName: RouteActionType) {
    this.$router.push({ name: routerName });
  }
  minify(event: any) {
    this.windowOpt(WinOpt.Minify);
  }
  closeMe() {
    this.windowOpt(WinOpt.CloseMe);
  }
  openMenu(id: MenuActionType) {
    this.$proxy.popup(id);
  }

  async getValue(identifier: Identifier) {
    return await this.$proxy.get(identifier);
  }

  async onResize() {
    if (this.routeName) {
      this.$proxy.saveWindow(this.routeName, this.size);
    }
    this.windowHeight = window.innerHeight;
    this.windowWidth = window.innerWidth;
  }

  mounted() {
    ipc.on(MessageType.WindowOpt.toString(), (event, arg) => {
      switch (arg.type) {
        case WinOpt.Zoom:
          this.setZoomFactor(arg.rotation);
          break;
      }
    });
    window.addEventListener("resize", this.onResize);

    ipc.on(MessageType.Router.toString(), (event, arg) => {
      this.changeModeNoSave(arg);
    });
    ipc.on(MessageType.WindowOpt.toString(), (event, arg) => {
      if (arg.type == WinOpt.SaveMode) {
        this.onResize();
      }
    });
    this.$nextTick(() => {
      ipc.send(MessageType.FirstLoaded.toString());
    });
    if (this.routeName) this.$proxy.restoreWindow(this.routeName);
  }

  destroyed() {
    window.removeEventListener("resize", this.onResize);
    this.onResize();
  }
}
</script>
