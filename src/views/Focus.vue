<template>
  <div>
    <StatusBar></StatusBar>
    <mu-row v-on:contextmenu="openMenu" ref="field" >
        <mu-text-field class="focusField" v-if="sharedResult" @input="onChange" v-model="sharedResult.result"  multi-line :rows-max="10"  full-width></mu-text-field>
    </mu-row>
  </div>
</template>

<script>
import StatusBar from "../components/StatusBar";
import BaseView from "./BaseView";
import WindowController from "../components/WindowController";
export default {
  name: "FocusMode",
  mixins: [BaseView, WindowController],
  components: { StatusBar },
  methods: {
    openMenu() {
      this.$controller.menu.popup();
    },
    onChange(value) {
      console.log("yes");
      console.log(this.$refs.field.clientHeight);
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.focusField {
  max-height: none;
}
</style>
