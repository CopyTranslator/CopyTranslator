<template>
  <div>
    <Action identifier="dragCopy"></Action>
    <br />
    <Action identifier="dragCopyMode"></Action>
    <p v-if="config.dragCopyMode !== 'dragCopyGlobal'" style="color: red;">
      {{ trans["dragCopyPrompt"] }}
    </p>
    <div v-if="config.dragCopyMode === 'dragCopyWhiteList'">
      <p>{{ trans["dragCopyWhiteList"] }}:</p>
      <v-select
        v-model="whitelist"
        :items="config.activeWindows"
        style="margin: 0px; padding: 0px;"
        multiple
        chips
      >
      </v-select>
    </div>
    <div v-if="config.dragCopyMode === 'dragCopyBlackList'">
      <p>{{ trans["dragCopyBlackList"] }}:</p>
      <v-select
        v-model="blacklist"
        :items="config.activeWindows"
        style="margin: 0px; padding: 0px;"
        multiple
        chips
      >
      </v-select>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import Action from "../components/Action.vue";
import Base from "@/components/Base.vue";

@Component({
  components: { Action },
})
export default class DrogCopyConfig extends Base {
  get whitelist() {
    return this.$store.state.config["dragCopyWhiteList"];
  }

  set whitelist(val) {
    this.callback("dragCopyWhiteList", val);
  }

  get blacklist() {
    return this.$store.state.config["dragCopyBlackList"];
  }

  set blacklist(val) {
    this.callback("dragCopyBlackList", val);
  }
}
</script>

<style scoped></style>
