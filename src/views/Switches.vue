<template>
  <v-expansion-panels v-model="panel">
    <div
      v-for="switchGroup in switchGroups"
      :key="switchGroup"
      style="width: 50%;"
    >
      <v-subheader style="text-align: left; padding: 0px;"
        >{{ trans[switchGroup] }}
      </v-subheader>
      <Action
        v-for="actionId in actionKeys[switchGroup]"
        :identifier="actionId"
        :key="actionId"
      ></Action>
    </div>
  </v-expansion-panels>
</template>

<script lang="ts">
import { shell } from "electron";
import { Component, Vue } from "vue-property-decorator";
import KeyConfig from "@/components/KeyConfig.vue";
import { structActionTypes, frequencies, Identifier } from "../common/types";
import Action from "../components/Action.vue";

@Component({
  components: {
    KeyConfig,
    Action,
  },
})
export default class SwitchGroups extends Vue {
  translators = structActionTypes;
  switchGroups = frequencies;
  actionKeys = this.$controller.action.getGroups("switches");
  panel = [0, 1];

  tutorial() {
    shell.openExternal("https://www.bilibili.com/video/av53888416/");
  }
  get trans() {
    return this.$store.getters.locale;
  }
}
</script>

<style scoped></style>
