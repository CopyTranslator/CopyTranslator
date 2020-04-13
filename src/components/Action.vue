<template>
  <div v-if="action">
    <v-switch
      v-if="action.type === 'checkbox'"
      v-model="value"
      class="myswitch"
      :label="$t(action.id)"
    ></v-switch>
    <div v-else-if="action.type === 'submenu'">
      <p style="margin:0px;">{{ $t(identifier) }}</p>
      <v-select
        v-model="command"
        :items="action.submenu"
        item-text="label"
        item-value="id"
        style="margin:0px;padding:0px;"
      >
      </v-select>
    </div>
    <div v-else-if="action.type === 'normal'">
      <v-btn @click="handleAction(action.id)">
        {{ $t(action.id) }}
      </v-btn>
    </div>
  </div>
</template>

<script lang="ts">
import { ipcRenderer as ipc } from "electron";
import { MessageType, WinOpt } from "../tools/enums";
import { Identifier } from "../tools/types";
import { Prop, Component, Watch, Vue } from "vue-property-decorator";
import { Action as ActionType, compose } from "../renderer/action";

@Component
export default class Action extends Vue {
  @Prop({ default: undefined }) readonly identifier!: Identifier;
  action: ActionType = this.$controller.action.getAction(this.identifier);

  handleAction(command: string) {
    this.$controller.action.callback(command);
  }

  get command() {
    return compose([this.identifier, this.value.toString()]);
  }

  set command(cmd) {
    this.handleAction(cmd);
  }

  get value() {
    return this.$store.state.config[this.identifier];
  }

  set value(val) {
    this.$controller.set(this.identifier, val);
  }
}
</script>

<style scoped>
.myswitch {
  margin: 0px;
}
.myswitch >>> .v-messages {
  min-height: 0px;
}
.myswitch >>> .v-input__slot {
  margin-bottom: 0px !important;
}
</style>
