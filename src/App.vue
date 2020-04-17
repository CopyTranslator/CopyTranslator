<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: "App"
});
</script>
<style>
#app {
  -webkit-font-smoothing: antialiased;
  font-family: "Microsoft YaHei", Arial, Helvetica, sans-serif, "宋体";
}
::-webkit-scrollbar {
  display: none;
}
</style>
