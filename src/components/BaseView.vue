<template>
  <div></div>
</template>

<script lang="ts">
import { Watch, Component, Vue, Mixins } from "vue-property-decorator";
import { Identifier } from "../tools/types";

@Component
export default class BaseView extends Vue {
  get sharedResult() {
    return this.$store.state.sharedResult;
  }

  get dictResult() {
    return this.$store.state.dictResult;
  }

  get config() {
    return this.$store.state.config;
  }

  set(key: Identifier, val: any) {
    this.$controller.set(key, val);
  }

  get size() {
    return this.config.contrast.fontSize;
  }
}
</script>
