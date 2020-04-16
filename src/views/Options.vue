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
import { Component, Mixins, Vue } from "vue-property-decorator";
import { Identifier } from "../common/types";

@Component({
  components: {
    Action
  }
})
export default class Options extends Vue {
  actionKeys: Identifier[] = this.$controller.action.getKeys("options");
}
</script>

<style scoped></style>
