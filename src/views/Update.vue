<!--
by: lizishan 2019-04-23
name: Update
notes:
-->
<template>
  <div>
    <h1 v-html="version"></h1>
    <h2 style="text-align:left">更新日志</h2>
    <div id="releaseNote" v-html="releaseNote"></div>
    <el-button v-if="!isMac" type="success" @click="autoDownload()"
      >自动下载更新</el-button
    >
    <el-button type="primary" @click="manualDownload()">手动下载更新</el-button>
  </div>
</template>

<script>
import { ipcRenderer, shell } from "electron";
import os from "os";

export default {
  name: "Update",
  data() {
    return {
      releaseNote: null,
      version: null,
      updateTitle: null,
      isMac: os.platform() !== "win32"
    };
  },

  methods: {
    autoDownload() {
      ipcRenderer.send("confirm-update");
    },
    manualDownload() {
      shell.openExternal(
        "https://copytranslator.github.io/guide/download.html"
      );
    }
  },
  created() {
    ipcRenderer.on("releaseNote", (event, data) => {
      this.releaseNote = data.releaseNotes;
      this.version = data.version + " " + data.releaseName;
    });
  }
};
</script>

<style scoped>
#version {
  padding-top: 30px;
}
#releaseNote {
  text-align: left;
  font-size: 14px;
  padding-left: 30px;
  height: 60vh;
}
</style>
