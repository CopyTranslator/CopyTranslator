<template>
  <div>
    <el-button type="text" style="width:100%;" @click="tutorial">
      Baidu文字识别API申请教程
    </el-button>
    <p>APP_ID</p>
    <el-input v-model="APP_ID"></el-input>
    <p>API_KEY</p>
    <el-input v-model="API_KEY"></el-input>
    <p>SECRET_KEY</p>
    <el-input v-model="SECRET_KEY"></el-input>
    <el-row :gutter="2">
      <el-col :span="12">
        <el-button type="primary" style="width:100%;" @click="confirm">{{
          $t("ok")
        }}</el-button>
      </el-col>
      <el-col :span="12">
        <el-button type="info" style="width:100%;" @click="close">{{
          $t("return")
        }}</el-button>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { RuleName } from "../tools/rule";
import WindowController from "../components/WindowController";
import { shell } from "electron";

export default {
  name: "OCRConfig",
  mixins: [WindowController],
  data() {
    return {
      APP_ID: this.$controller.get(RuleName.APP_ID),
      API_KEY: this.$controller.get(RuleName.API_KEY),
      SECRET_KEY: this.$controller.get(RuleName.SECRET_KEY)
    };
  },
  methods: {
    confirm() {
      this.$controller.setUpRecognizer(
        this.APP_ID,
        this.API_KEY,
        this.SECRET_KEY
      );
      this.closeMe();
    },
    close() {
      this.closeMe();
    },
    tutorial() {
      shell.openExternal("https://www.bilibili.com/video/av53888416/");
    }
  }
};
</script>

<style scoped></style>
