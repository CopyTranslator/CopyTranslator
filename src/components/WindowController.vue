<template>
  <div></div>
</template>

<script lang="ts">
import { MessageType, WinOpt } from "../tools/enums";
import { ipcRenderer as ipc, webFrame } from "electron";
import { Identifier } from "../tools/identifier";
import Vue from "vue";
import Component, { mixins } from "vue-class-component";

@Component
export default class WindowController extends Vue {
  routeName: Identifier | undefined = undefined;
  size: number = 20;
  windowHeight: number = window.innerHeight;
  windowWidth: number = window.innerWidth;

  setZoomFactor(value: number) {
    this.size -= value;
  }
  syncHeight() {
    this.windowHeight = window.innerHeight;
    this.windowWidth = window.innerWidth;
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
  changeMode(routerName: Identifier) {
    this.$proxy.routeTo(routerName);
  }
  changeModeNoSave(routerName: Identifier) {
    this.$router.push({ name: routerName });
  }
  minify(event: any) {
    this.windowOpt(WinOpt.Minify);
  }
  closeMe() {
    this.windowOpt(WinOpt.CloseMe);
  }
  openMenu(id: RouteName) {
    this.$proxy.popup(id);
  }
  resize(w = null, h = null, x = null, y = null) {
    this.windowOpt(WinOpt.Resize, {
      h: h,
      w: w,
      x: x,
      y: y
    });
  }
  async storeWindow() {
    if (this.routeName) {
      this.$proxy.saveWindow(
        this.routeName,
        await this.$proxy.getBound(),
        this.size
      );
    }
  }

  mounted() {
    ipc.on(MessageType.WindowOpt.toString(), (event, arg) => {
      switch (arg.type) {
        case WinOpt.Zoom:
          this.setZoomFactor(arg.rotation);
          break;
      }
    });
    window.addEventListener("resize", this.syncHeight);
    ipc.on(MessageType.Router.toString(), (event, arg) => {
      this.changeModeNoSave(arg);
    });
    ipc.on(MessageType.WindowOpt.toString(), (event, arg) => {
      if (arg.type == WinOpt.SaveMode) {
        this.storeWindow();
      }
    });

    this.$nextTick(() => {
      ipc.send(MessageType.FirstLoaded.toString());
    });
    if (this.routeName) this.$proxy.restoreWindow(this.routeName);
  }

  destroyed() {
    window.removeEventListener("resize", this.syncHeight);
    this.storeWindow();
  }
}
</script>
