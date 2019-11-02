<template>
  <v-row>
    <v-col cols="6" class="areaWarpper" style="padding-left:0;">
      <textarea class="area"></textarea>
    </v-col>
    <v-col cols="6" class="areaWarpper" style="padding-right:0;">
      <textarea class="area"></textarea>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  data: () => ({
    drawer: null,
    drawerRight: null,
    right: false,
    left: false
  })
});
</script>
<style scoped>
.area {
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
