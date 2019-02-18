<template>
  <div>
    <StatusBar ref="bar"></StatusBar>
    <div v-on:contextmenu="openMenu('Focus')">
    <textarea 
       :style="focusStyle"
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

export default {
  name: "FocusMode",
  mixins: [BaseView, WindowController, Adjustable],
  components: { StatusBar },
  data: function() {
    return {
      size: this.$controller.config.values.focus.fontSize
    };
  },
  computed: {
    focusStyle() {
      return `fontSize:${this.size.toString()}px;width:100%;height:${this
        .windowHeight - this.barHeight}px;`;
    }
  },
  mounted: function() {
    this.barHeight = this.$refs.bar.$el.clientHeight;
    this.$controller.restoreWindow("focus");
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
