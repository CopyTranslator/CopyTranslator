<template>
  <div></div>
</template>

<script lang="ts">
import { RouteActionType } from "../common/types";
import Vue from "vue";
import Component from "vue-class-component";

@Component
export default class WindowController extends Vue {
  routeName: RouteActionType | null = null;
  //之所以不用window.innerHeight是因为他不会触发vue的响应式更新，所以我们只能监听resize事件然后手动更新
  windowHeight: number = window.innerHeight;
  windowWidth: number = window.innerWidth;
  lastSync: number = 0;

  async onResize() {
    this.windowHeight = window.innerHeight;
    this.windowWidth = window.innerWidth;
  }

  mounted() {
    window.addEventListener("resize", this.onResize);
    this.onResize();
  }

  destroyed() {
    window.removeEventListener("resize", this.onResize);
    this.onResize();
  }
}
</script>
