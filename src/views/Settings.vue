<template>
  <div style="height:100%">
    <div style="height:80%">
      <el-tabs v-model="activeName">
        <el-tab-pane :label="$t('options')" name="first">
          <Options></Options>
        </el-tab-pane>
        <el-tab-pane :label="$t('switches')" name="second">
          <Switches></Switches>
        </el-tab-pane>
        <el-tab-pane :label="$t('OCRConfig')" name="third">
          <OCRConfig></OCRConfig>
        </el-tab-pane>
        <el-tab-pane :label="$t('OCRConfig')" name="fourth">
          <MenuDrag></MenuDrag>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import { RuleName } from "../tools/rule";
import WindowController from "../components/WindowController";
import { shell } from "electron";
import Options from "./Options";
import OCRConfig from "./OCRConfig";
import Switches from "./Switches";
import MenuDrag from "./MenuDrag";

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
    Options,
    OCRConfig,
    Switches,
    MenuDrag
  }
};
</script>

<style scoped></style>
