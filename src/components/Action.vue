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
        this.$controller.action.callback(newEnumValue);
      }
    }
  },
  methods: {
    setValue() {
      this.$controller.set(this.identifier, this.checked, true, false);
    },
    sync() {
      this.action = this.$controller.action.getAction(this.identifier);
      const value = this.$controller.config.get(this.identifier);
      switch (this.action.actionType) {
        case "checkbox":
          this.checked = value;
          break;
        case "submenu":
          if (this.action.subMenuGenerator)
            this.enums = this.action.subMenuGenerator();
          else {
            this.enums = this.action.submenu;
          }
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
