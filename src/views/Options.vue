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
import { Identifier } from "../tools/types";

@Component({
  components: {
    Action
  }
})
export default class Options extends Vue {
  actionKeys: Identifier[] = [];
  mounted() {
    // this.$proxy.getKeys("options").then(res => {
    //   this.actionKeys = res;
    // });
  }
}
</script>

<style scoped></style>
