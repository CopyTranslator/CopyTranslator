<template>
  <div>
    <div style="text-align: left;">
      <Action
        v-for="actionId in actionKeys"
        :identifier="actionId"
        :key="actionId"
      ></Action>
    </div>
  </div>
</template>

<script lang="ts">
import Action from "../components/Action.vue";
import Component from "vue-class-component";
import Vue from "vue";
import { Identifier } from "../tools/types";

@Component({
  components: {
    Action
  }
})
export default class Switches extends Vue {
  actionKeys: Identifier[] = [];

  mounted() {
    // this.$proxy.getKeys("switches").then((keys: Identifier[]) => {
    //   this.actionKeys = keys;
    // });
  }
}
</script>

<style scoped></style>
