<template>
    <div>
        <StatusBar ref="bar"></StatusBar>
        <div v-on:contextmenu="openMenu('Focus')">
    <textarea class="focusText"
              v-bind:style="focusStyle"
              v-model="sharedResult.result" v-if="sharedResult&&!sharedResult.dict"
    ></textarea>
            <DictResult :size="size"></DictResult>
        </div>
    </div>
</template>

<script>
import StatusBar from "../components/StatusBar";
import BaseView from "../components/BaseView";
import WindowController from "../components/WindowController";
import Adjustable from "../components/Adjustable";
import DictResult from "../components/DictResult";

export default {
  name: "FocusMode",
  mixins: [BaseView, WindowController, Adjustable],
  components: { DictResult, StatusBar },
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
