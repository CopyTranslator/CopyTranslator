<template>
  <div style="height:100%">
    <div style="height:80%">
      <el-tabs v-model="activeName">
        <el-tab-pane :label="$t('settings')" name="first">
          <Settings></Settings>
        </el-tab-pane>
        <el-tab-pane :label="$t('ApiConfig')" name="second">
          <ApiConfig></ApiConfig>
        </el-tab-pane>
        <el-tab-pane :label="$t('ApiConfig')" name="third">
          <SwitchPanel></SwitchPanel>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import { RuleName } from "../tools/rule";
import WindowController from "../components/WindowController";
import { shell } from "electron";
import Settings from "./Settings";
import ApiConfig from "./ApiConfig";
import SwitchPanel from "./SwitchPanel";

export default {
  name: "Focus",
  mixins: [WindowController],
  data() {
    return {
      activeName: "first"
    };
  },
  methods: {},
  components: {
    Settings,
    ApiConfig,
    SwitchPanel
  }
};
</script>

<style scoped></style>
