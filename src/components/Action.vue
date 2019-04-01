<template>
  <div v-if="action">
    <el-switch
      v-if="action.type === 'checkbox'"
      v-model="checked"
      :active-text="$t(action.id)"
      @change="setValue()"
    ></el-switch>
    <div v-else-if="action.type === 'submenu'">
      <p>{{ $t(actionId) }}</p>
      <el-select v-model="enumValue">
        <el-option
          v-for="item in enums"
          :key="item.id"
          :label="item.label"
          :value="item.id"
        ></el-option>
      </el-select>
    </div>
  </div>
</template>

<script>
import { compose, decompose } from "../tools/action";
import { ipcRenderer as ipc } from "electron";
import { MessageType, WinOpt } from "../tools/enums";

export default {
  name: "Action",
  props: ["actionId"],
  data: function() {
    return {
      action: undefined,
      checked: false,
      enumValue: undefined,
      enums: []
    };
  },
  watch: {
    enumValue(newEnumValue, oldEnumValue) {
      if (oldEnumValue) {
        this.$controller.setByKeyValue(
          this.actionId,
          decompose(this.enumValue)[1],
          true,
          false
        );
      }
    }
  },
  methods: {
    setValue() {
      this.$controller.setByKeyValue(this.actionId, this.checked, true, false);
    },
    sync() {
      this.action = this.$controller.action.actions[this.actionId];
      const value = this.$controller.config.values[this.actionId];
      switch (this.action.type) {
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
            this.actionId,
            typeof value == "string" ? value : value.toString()
          ]);
          break;
      }
    }
  },
  mounted() {
    ipc.on(MessageType.WindowOpt.toString(), (event, arg) => {
      if (arg.type === WinOpt.Refresh) {
        if (!arg.args || arg.args === this.actionId) {
          this.sync();
        }
      }
    });
    this.sync();
  }
};
</script>

<style scoped></style>
