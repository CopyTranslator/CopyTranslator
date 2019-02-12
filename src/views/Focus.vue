<template>
  <div>
    <StatusBar></StatusBar>
        <mu-text-field v-on:contextmenu="openMenu" class="focusField" v-if="sharedResult"  v-model="result"  multi-line :rows-max="50"  full-width></mu-text-field>    
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
  data: function() {
    return {
      result: ""
    };
  },
  methods: {
    onChange(value = null) {
      this.resize(null, this.$el.clientHeight);
    }
  },
  watch: {
    sharedResult: function(newSharedResult, oldSharedResult) {
      this.result = newSharedResult.result;
      console.log("changed");
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
