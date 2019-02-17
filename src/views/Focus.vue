<template>
  <div v-resize="onChange" >
    <StatusBar></StatusBar>
    <div v-on:contextmenu="openMenu('Focus')">
    <v-textarea 
          full-width  rows=1 :row-height="h" v-if="sharedResult"  v-model="result"  auto-grow 
        ></v-textarea>
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
      result: "",
      size: this.$controller.config.values.focus.fontSize,
      h: 50
    };
  },
  methods: {
    onChange(value = null) {
      this.resize(null, this.$el.clientHeight);
    }
  },
  computed: {
    height() {
      return this.size * 2;
    }
  },
  watch: {
    sharedResult: function(newSharedResult, oldSharedResult) {
      this.result = newSharedResult.result;
    },
    result: function(newSource, oldSource) {
      this.onChange();
    }
  },
  mounted: function() {
    this.onChange();
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
