<template>
  <div></div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import bus from "@/common/event-bus";
import { Identifier, MenuActionType, ColorStatus } from "../common/types";

@Component
export default class Base extends Vue {
  callback(...args: any[]) {
    bus.at("dispatch", ...args);
  }

  get config() {
    return this.$store.state.config;
  }

  get trans() {
    return this.$store.getters.locale;
  }

  set(key: Identifier, val: any) {
    this.$controller.set(key, val);
  }

  get titlebarHeight() {
    return `${this.titlebarHeightVal}px`;
  }

  get titlebarHeightVal() {
    return this.config.titlebarHeight;
  }

  openMenu(id: MenuActionType) {
    bus.iat("openMenu", id);
  }

  get fontColor() {
    const color = this.config.fontColor;
    if (this.$vuetify.theme.dark) {
      return color.dark;
    } else {
      return color.light;
    }
  }

  get status(): ColorStatus {
    return this.$store.state.status;
  }
}
</script>
