<template>
  <div v-if="action">
    <v-switch
      v-if="action.type === 'checkbox'"
      v-model="checked"
      class="myswitch"
      :label="$t(action.id)"
      @change="setValue()"
    ></v-switch>
    <div v-else-if="action.type === 'submenu'">
      <p style="margin:0px;">{{ $t(identifier) }}</p>
      <v-select
        v-model="command"
        :items="options"
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
import { compose, decompose } from "../tools/action";
import { ipcRenderer as ipc } from "electron";
import { MessageType, WinOpt } from "../tools/enums";
import { Identifier } from "../tools/types";
import { Prop, Component, Watch, Vue } from "vue-property-decorator";
import { Action as ActionType } from "../tools/action";

@Component
export default class Action extends Vue {
  @Prop({ default: undefined }) readonly identifier!: Identifier;

  action: ActionType | null = null;
  checked: boolean = false;
  value: any = null;
  command: string | null = null;
  options: any = null;

  @Watch("command")
  commandChanged(newcommand: string, oldcommand: string) {
    if (oldcommand) {
      this.handleAction(newcommand);
    }
  }

  setValue() {
    this.$proxy.set(this.identifier, this.checked, true, true);
  }

  handleAction(command: string) {
    this.$proxy.handleAction(command);
  }

  async sync() {
    this.action = await this.$proxy.getAction(this.identifier);
    const value = await this.$proxy.get(this.identifier);
    switch (this.action.actionType) {
      case "checkbox":
        this.checked = value;
        break;
      case "submenu":
        this.options = this.action.submenu;
        this.command = compose([
          this.identifier,
          typeof value == "string" ? value : value.toString()
        ]);
        break;
      case "constant":
        this.value = value;
        break;
    }
  }

  mounted() {
    ipc.on(MessageType.WindowOpt.toString(), (event, arg) => {
      if (arg.type === WinOpt.Refresh) {
        if (!arg.args || arg.args === this.identifier) {
          this.sync();
        }
      }
    });
    this.sync();
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
