<template>
  <div></div>
</template>

<script lang="ts">
import { Watch, Component, Vue, Mixins } from "vue-property-decorator";

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
}
</script>
