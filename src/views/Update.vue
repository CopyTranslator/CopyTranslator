<!--
by: lizishan 2019-04-23
name: Update
notes:
-->
<template>
  <div>
    <h1 v-html="version"></h1>
    <h2>更新日志:</h2>
    <div v-html="releaseNote"></div>
    <el-button type="primary" @click="confirmUpdate()">下载更新</el-button>
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
      updateTitle: null
    };
  },

  methods: {
    confirmUpdate() {
      if (os.platform() === "win32") {
        ipcRenderer.send("confirm-update");
      } else {
        shell.openExternal(
          `https://github.com/CopyTranslator/CopyTranslator/releases/tag/v${
            this.version
          }`
        );
      }
    }
  },
  created() {
    ipcRenderer.on("releaseNote", (event, data) => {
      this.releaseNote = data.releaseNotes;
      this.version = data.version + " " + data.releaseName;
    });
    ipcRenderer.send("releaseNote");
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
  height: 60%;
}
</style>
