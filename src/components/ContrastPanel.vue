<template>
  <div style="height: 100%;width: 100%;">
    <v-row v-if="horizontal" style="height: 100%;width: 100%;">
      <v-col class="areaWarpper" style="width:50%">
        <textarea class="hArea"></textarea>
      </v-col>
      <v-col class="areaWarpper" style="width:50%;">
        <textarea class="hArea"></textarea>
      </v-col>
    </v-row>
    <v-col v-else style="height: 100%;width: 100%;">
      <div class="areaWarpper" style="padding-left:0;height: 50%;">
        <textarea class="hArea"></textarea>
      </div>
      <div class="areaWarpper" style="padding-right:0;height: 50%;">
        <textarea class="vArea"></textarea>
      </div>
    </v-col>
  </div>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  data: () => ({}),
  computed: {
    horizontal() {
      return this.$store.state.horizontal;
    }
  }
});
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
