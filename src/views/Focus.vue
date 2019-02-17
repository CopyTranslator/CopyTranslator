<template>
  <div v-resize="onChange" >
    <StatusBar></StatusBar>
    <div v-on:contextmenu="openMenu('Focus')">
      
    <textarea  id="area"
       :style="fontSize"
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
      size: this.$controller.config.values.focus.fontSize,
      h: 50
    };
  },
  methods: {
    onChange(value = null) {}
  },
  computed: {
    height() {
      return this.size.toString();
    }
  },
  watch: {
    sharedResult: function(newSharedResult, oldSharedResult) {
      this.result = newSharedResult.result;
    },
    result: function(newSource, oldSource) {}
  },
  mounted: function() {
    this.onChange();
    disableScroll.on();
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
