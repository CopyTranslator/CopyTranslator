<template>
  <div>
    <div v-on:dblclick="minify" style="text-align: left;">
      <div style="text-align: left;">
        <Action
          v-for="actionId in actionKeys"
          :identifier="actionId"
          :key="actionId"
        ></Action>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import WindowController from "../components/WindowController.vue";
import Action from "../components/Action.vue";
import { Component, Mixins } from "vue-property-decorator";
import { Identifier } from "../tools/types";

@Component({
  components: {
    Action
  }
})
export default class Options extends WindowController {
  actionKeys: Identifier[] = [];
  mounted() {
    this.$proxy.getKeys("options").then(res => {
      this.actionKeys = res;
    });
  }
}
</script>

<style scoped></style>
