<template>
  <div style="height: 100%;width: 100%;">
    <v-row v-if="horizontal" style="height: 100%;width: 100%;margin:0px;">
      <v-col class="areaWarpper" style="width:50%;padding:0px;">
        <textarea class="hArea" v-model="sharedResult.src"></textarea>
      </v-col>
      <v-col class="areaWarpper" style="width:50%;padding:0px;">
        <textarea class="hArea" v-model="sharedResult.result"></textarea>
      </v-col>
    </v-row>
    <v-col v-else style="height: 100%;width: 100%;">
      <div class="areaWarpper" style="padding:0;height: 50%;">
        <textarea class="vArea" v-model="sharedResult.src"></textarea>
      </div>
      <div class="areaWarpper" style="padding:0;height: 50%;">
        <textarea class="vArea" v-model="sharedResult.result"></textarea>
      </div>
    </v-col>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import BaseView from "../components/BaseView.vue";
import { Mixins, Watch } from "vue-property-decorator";
import WindowController from "../components/WindowController.vue";

export default class ContrastPanel extends Mixins(BaseView, WindowController) {
  get horizontal() {
    return this.$store.state.horizontal;
  }
}
</script>
<style scoped>
.hArea {
  height: 100%;
  width: 100%;
  border: solid 1px #bebebe;
  resize: none;
  padding: 0;
}
.vArea {
  height: 100%;
  width: 100%;
  border: solid 1px #bebebe;
  resize: none;
  padding: 0;
}
.areaWarpper {
  border: solid 1px #d3d3d3;
  padding-bottom: 0;
  padding-top: 0;
}
.myswitch >>> .v-messages {
  min-height: 0px;
}
</style>
