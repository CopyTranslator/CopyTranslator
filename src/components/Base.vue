<template>
  <div></div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import bus from "@/common/event-bus";

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

  get titlebarHeight() {
    return `${this.$store.state.titlebarHeight}px`;
  }

  get titlebarHeightVal() {
    return this.$store.state.titlebarHeight;
  }
}
</script>
