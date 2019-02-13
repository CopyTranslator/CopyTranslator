<template>
  <div v-resize="hello">
    <StatusBar></StatusBar>
    <mu-text-field :style="fontSize"  v-on:contextmenu="openMenu('Focus')" class="focusField" v-if="sharedResult"  v-model="result"  multi-line :rows-max="50"  full-width></mu-text-field>    
  </div>
</template>

<script>
import StatusBar from "../components/StatusBar";
import BaseView from "./BaseView";
import WindowController from "../components/WindowController";
import resize from "vue-resize-directive";
import Adjustable from "./Adjustable";
export default {
  name: "FocusMode",
  mixins: [BaseView, WindowController, Adjustable],
  components: { StatusBar },
  directives: {
    resize
  },
  data: function() {
    return {
      result: "",
      size: this.$controller.config.values.focus.fontSize
    };
  },
  methods: {
    hello() {
      console.log("???");
    },
    onChange(value = null) {
      this.resize(null, this.$el.clientHeight);
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
.focusField {
  max-height: none;
}
</style>
