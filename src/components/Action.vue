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
        <el-select v-model="enumValue">
          <el-option
            v-for="item in enums"
            :key="item.id"
            :label="item.label"
            :value="item.id"
          ></el-option>
        </el-select>
      </div>
    </el-tooltip>
  </div>
</template>

<script>
import { compose, decompose } from "../tools/action";
import { ipcRenderer as ipc } from "electron";
import { MessageType, WinOpt } from "../tools/enums";

export default {
  name: "Action",
  props: ["identifier"],
  data: function() {
    return {
      action: undefined,
      checked: false,
      value: undefined,
      enumValue: undefined,
      enums: []
    };
  },
  watch: {
    enumValue(newEnumValue, oldEnumValue) {
      if (oldEnumValue) {
        this.$proxy.handleAction(newEnumValue);
      }
    }
  },
  methods: {
    setValue() {
      this.$proxy.set(this.identifier, this.checked, true, false);
    },
    async sync() {
      this.action = await this.$proxy.getAction(this.identifier);
      const value = await this.$proxy.get(this.identifier);
      switch (this.action.actionType) {
        case "checkbox":
          this.checked = value;
          break;
        case "submenu":
          this.enums = this.action.submenu;
          this.enumValue = compose([
            this.identifier,
            typeof value == "string" ? value : value.toString()
          ]);
          break;
        case "constant":
          this.value = value;
          break;
      }
    }
  },
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
};
</script>

<style scoped></style>
