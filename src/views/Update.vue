<template>
  <div>
    <div v-if="version">
      <h1 v-html="version"></h1>
      <h2>更新日志</h2>
      <div id="releaseNote" v-html="releaseNote"></div>
      <v-row>
        <v-col>
          <v-btn v-if="!isMac" @click="autoDownload()" color="success">
            自动下载更新
          </v-btn>
        </v-col>
        <v-col>
          <v-btn @click="manualDownload()" color="primary">手动下载更新</v-btn>
        </v-col>
      </v-row>
    </div>
  </div>
</template>

<script lang="ts">
import { ipcRenderer, shell } from "electron";
import os from "os";
import { Watch, Component, Vue, Mixins } from "vue-property-decorator";

@Component
export default class UpdatePanel extends Vue {
  releaseNote: string | undefined;
  version: string | boolean = false;
  updateTitle: string | undefined;
  isMac: boolean = os.platform() !== "win32";

  autoDownload() {
    ipcRenderer.send("confirm-update");
  }
  manualDownload() {
    shell.openExternal("https://copytranslator.github.io/guide/download.html");
  }

  mounted() {
    ipcRenderer.on("releaseNote", (event, data) => {
      this.releaseNote = data.releaseNotes;
      this.version = data.version + " " + data.releaseName;
    });
  }
}
</script>

<style scoped></style>
