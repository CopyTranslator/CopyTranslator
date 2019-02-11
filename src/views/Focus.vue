<template>
  <div>
    <StatusBar></StatusBar>
    <mu-row v-on:contextmenu="openMenu">
        <mu-text-field v-if="sharedResult" v-model="sharedResult.result"  multi-line :rows="4" full-width></mu-text-field>
    </mu-row>

  </div>
</template>

<script>
import StatusBar from "../components/StatusBar";
import BaseView from "./BaseView";
export default {
  name: "FocusMode",
  mixins: [BaseView],
  components: { StatusBar },
  methods: {
    openMenu() {
      this.$controller.menu.popup({});
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
