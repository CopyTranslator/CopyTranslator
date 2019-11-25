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
.active {
  margin-left: 200px;
}
::-webkit-scrollbar {
  display: none;
}
</style>
