<template>
  <div>
    <v-btn type="text" style="width:100%;" @click="tutorial">
      Baidu文字识别API申请教程
    </v-btn>
    <p>APP_ID</p>
    <v-text-field v-model="APP_ID"></v-text-field>
    <p>API_KEY</p>
    <v-text-field v-model="API_KEY"></v-text-field>
    <p>SECRET_KEY</p>
    <v-text-field v-model="SECRET_KEY"></v-text-field>
    <v-btn color="primary" style="width:100%;" @click="confirm">{{
      $t("ok")
    }}</v-btn>
  </div>
</template>

<script lang="ts">
import { shell } from "electron";
import { Component, Vue } from "vue-property-decorator";

@Component
export default class OCRConfig extends Vue {
  APP_ID: string = "";
  API_KEY: string = "";
  SECRET_KEY: string = "";

  mounted() {
    this.$proxy.get("APP_ID").then(res => {
      this.APP_ID = res;
    });
    this.$proxy.get("API_KEY").then(res => {
      this.API_KEY = res;
    });
    this.$proxy.get("SECRET_KEY").then(res => {
      this.SECRET_KEY = res;
    });
  }
  confirm() {
    this.$proxy.setUpRecognizer(this.APP_ID, this.API_KEY, this.SECRET_KEY);
  }
  close() {}
  tutorial() {
    shell.openExternal("https://www.bilibili.com/video/av53888416/");
  }
}
</script>

<style scoped></style>
