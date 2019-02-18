<template>
  <div>
    <StatusBar ref="bar"></StatusBar>
    <div v-on:contextmenu="openMenu('Focus')">
    <textarea 
       :style="focusStyle"
          v-model="result" v-if="sharedResult"  
        ></textarea> 
      </div>
  </div>
</template>

<script>
import disableScroll from "disable-scroll";
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
      result: "",
      size: this.$controller.config.values.focus.fontSize
    };
  },
  methods: {},
  computed: {
    focusStyle() {
      return `fontSize:${this.size.toString()}px;width:100%;height:${this
        .windowHeight - this.barHeight}px;`;
    }
  },
  watch: {
    sharedResult: function(newSharedResult, oldSharedResult) {
      this.result = newSharedResult.result;
    },
    result: function(newSource, oldSource) {}
  },
  mounted: function() {
    this.barHeight = this.$refs.bar.$el.clientHeight;
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
