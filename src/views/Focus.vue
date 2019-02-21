<template>
    <div>
        <StatusBar ref="bar"></StatusBar>
        <div v-on:contextmenu="openMenu('Focus')">
    <textarea class="focusText"
              v-bind:style="focusStyle"
              v-model="sharedResult.result" v-if="sharedResult"
    ></textarea>
        </div>
    </div>
</template>

<script>
import StatusBar from "../components/StatusBar";
import BaseView from "./BaseView";
import WindowController from "../components/WindowController";
import Adjustable from "./Adjustable";
import { constants } from "http2";

export default {
  name: "FocusMode",
  mixins: [BaseView, WindowController, Adjustable],
  components: { StatusBar },
  data: function() {
    return {
      size: this.$controller.config.values.focus.fontSize,
      routeName: "focus"
    };
  },
  computed: {
    focusStyle() {
      return {
        fontSize: this.size.toString() + "px",
        width: "100%",
        height: (this.windowHeight - this.barHeight).toString() + "px"
      };
    }
  },
  mounted: function() {
    this.barHeight = this.$refs.bar.$el.clientHeight;
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
