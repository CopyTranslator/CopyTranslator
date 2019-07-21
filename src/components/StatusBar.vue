<template>
  <div>
    <StatusBarV3 v-if="type === 2"></StatusBarV3>
    <StatusBarV2 v-else-if="type === 1"></StatusBarV2>
    <StatusBarV1 v-else-if="type === 0"></StatusBarV1>
  </div>
</template>

<script>
import WindowController from "./WindowController";
import { MessageType, WinOpt } from "../tools/enums";
import { ipcRenderer as ipc } from "electron";
import StatusBarV3 from "./StatusBarV3";
import { RuleName } from "../tools/rule";
import StatusBarV2 from "./StatusBarV2";
import StatusBarV1 from "./StatusBarV1";

export default {
  components: { StatusBarV3, StatusBarV2, StatusBarV1 },
  data: function() {
    return {
      type: this.$controller.get(RuleName.titleBar)
    };
  }
};
</script>
