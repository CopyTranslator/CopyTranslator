<template>
  <div></div>
</template>

<script lang="ts">
import { RouteActionType, MenuActionType, Identifier } from "../common/types";
import Vue from "vue";
import Component from "vue-class-component";
import bus from "../common/event-bus";

@Component
export default class WindowController extends Vue {
  routeName: RouteActionType | null = null;
  windowHeight: number = window.innerHeight;
  windowWidth: number = window.innerWidth;

  callback(...args: any[]) {
    bus.at("dispatch", ...args);
  }

  close() {
    this.callback("closeWindow");
  }

  minify() {
    this.callback("hideWindow");
  }

  openMenu(id: MenuActionType) {
    bus.iat("openMenu", id);
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

  get trans() {
    return this.$store.getters.locale;
  }
}
</script>
