<template>
  <div v-if="action">
    <el-tooltip
      effect="light"
      :content="action.tooltip"
      placement="top-start"
      :open-delay="1000"
    >
      <el-switch
        v-if="action.type === 'checkbox'"
        v-model="checked"
        :active-text="$t(action.id)"
        @change="setValue()"
      ></el-switch>
      <div v-else-if="action.type === 'submenu'">
        <p>{{ $t(identifier) }}</p>
        <el-select v-model="command">
          <el-option
            v-for="item in options"
            :key="item.id"
            :label="item.label"
            :value="item.id"
          ></el-option>
        </el-select>
      </div>
      <div v-else-if="action.type === 'normal'">
        <el-button type="primary" @click="handleAction(action.id)">
          {{ $t(action.id) }}
        </el-button>
      </div>
    </el-tooltip>
  </div>
</template>

<script lang="ts">
/* eslint-disable */
import { compose, decompose } from "../tools/action";
import { ipcRenderer as ipc } from "electron";
import { MessageType, WinOpt } from "../tools/enums";

// @ts-ignore /* eslint-disable */
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

<style scoped></style>
