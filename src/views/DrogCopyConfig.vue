<template>
  <div>
    <Action identifier="dragCopyMode"></Action>
    <p v-if="config.dragCopyMode !== 'dragCopyGlobal'">
      {{ trans["dragCopyPrompt"] }}
    </p>
    <div v-if="config.dragCopyMode === 'dragCopyWhiteList'">
      <p>{{ trans["dragCopyWhiteList"] }}</p>
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
      <p>{{ trans["dragCopyBlackList"] }}</p>
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
import bus from "@/common/event-bus";
import Action from "../components/Action.vue";

@Component({
  components: { Action },
})
export default class DrogCopyConfig extends Vue {
  get trans() {
    return this.$store.getters.locale;
  }
  callback(...args: any[]) {
    bus.at("dispatch", ...args);
  }

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

  get config() {
    return this.$store.state.config;
  }
}
</script>

<style scoped></style>
