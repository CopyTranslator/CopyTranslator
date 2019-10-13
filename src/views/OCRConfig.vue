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
    <el-button type="primary" style="width:100%;" @click="confirm">{{
      $t("ok")
    }}</el-button>
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
      APP_ID: undefined,
      API_KEY: undefined,
      SECRET_KEY: undefined
    };
  },
  mounted: function() {
    this.$proxy.get("APP_ID").then(res => {
      this.APP_ID = res;
    });
    this.$proxy.get("API_KEY").then(res => {
      this.API_KEY = res;
    });
    this.$proxy.get("SECRET_KEY").then(res => {
      this.SECRET_KEY = res;
    });
  },
  methods: {
    confirm() {
      this.$proxy.setUpRecognizer(this.APP_ID, this.API_KEY, this.SECRET_KEY);
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
