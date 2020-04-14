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
import { Identifier } from "../common/types";

@Component({
  components: {
    Action
  }
})
export default class Switches extends Vue {
  actionKeys: Identifier[] = this.$controller.action.getKeys("switches");
}
</script>

<style scoped></style>
