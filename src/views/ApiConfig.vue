<!--
by: lizishan 2019-04-23
name: Update
notes:
-->
<template>
  <div>
    <StatusBar ref="bar"></StatusBar>
    <el-button type="text" style="width:100%;" @click="tutorial">
      Baidu文字识别API申请教程
    </el-button>
    <p>APP_ID</p>
    <el-input v-model="APP_ID"></el-input>
    <p>API_KEY</p>
    <el-input v-model="API_KEY"></el-input>
    <p>SECRET_KEY</p>
    <el-input v-model="SECRET_KEY"></el-input>
    <el-button style="width:100%;" @click="backStored">{{
      $t("return")
    }}</el-button>
  </div>
</template>

<script>
import { RuleName } from "../tools/rule";
import WindowController from "../components/WindowController";
import StatusBar from "../components/StatusBar";
import { shell } from "electron";

export default {
  name: "Focus",
  mixins: [WindowController],
  components: { StatusBar },
  data() {
    return {
      routeName: "Focus",
      APP_ID: this.$controller.get(RuleName.APP_ID),
      API_KEY: this.$controller.get(RuleName.API_KEY),
      SECRET_KEY: this.$controller.get(RuleName.SECRET_KEY)
    };
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      if (from.name) vm.$controller.win.stored = from.name;
    });
  },
  methods: {
    backStored() {
      this.$controller.setUpRecognizer(
        this.APP_ID,
        this.API_KEY,
        this.SECRET_KEY
      );
      this.changeMode(this.$controller.win.stored);
    },
    tutorial() {
      shell.openExternal("https://www.bilibili.com/video/av53888416/");
    }
  }
};
</script>

<style scoped></style>
