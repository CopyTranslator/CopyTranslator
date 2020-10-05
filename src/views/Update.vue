<template>
  <div style="height: 100vh;">
    <v-app>
      <div v-if="version" style="height: 100%;">
        <h2 style="text-align: center;" v-html="version"></h2>
        <h3 style="text-align: center;">更新日志</h3>
        <div style="height: 50%; margin: 7%;">
          <div id="releaseNote" v-html="releaseNote"></div>
        </div>
        <v-row>
          <v-col v-if="!isMac">
            <v-btn @click="autoDownload()" color="#33" style="width: 100%;">
              自动下载更新
            </v-btn>
          </v-col>
          <v-col>
            <v-btn @click="manualDownload()" color="#44" style="width: 100%;"
              >手动下载更新</v-btn
            >
          </v-col>
        </v-row>
      </div>
    </v-app>
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
    shell.openExternal("https://copytranslator.gitee.io/download/");
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
