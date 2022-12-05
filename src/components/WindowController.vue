<template>
  <div></div>
</template>

<script lang="ts">
import { RouteActionType } from "../common/types";
import Vue from "vue";
import Component from "vue-class-component";
import bus from "@/common/event-bus";

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

    const now = Date.now();
    if (this.lastSync > now) {
      //就说明我们不需要唤起一次新的同步
    } else {
      const interval = 1000; //修改后预定一次保存，在此保存之前的所有修改都不会再预定保存
      this.lastSync = now + interval;
      setTimeout(() => {
        this.saveBounds();
      }, interval);
    }
  }
  // 这个函数是为了解决窗口大小没有及时保存的问题
  saveBounds() {
    const now = Date.now();
    if (now > this.lastSync) {
      this.lastSync = now;
    }
    bus.iat("preSet", "layoutType", null); //利用preset进行更新
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
