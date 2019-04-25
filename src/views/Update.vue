<!--
by: lizishan 2019-04-23
name: Update
notes:
-->
<template>
  <div id="update">
    <p v-html="releaseName" id="version"></p>
    <p>更新日志:</p>
    <div v-html="releaseNote" id="releaseNote"></div>
    <button @click="confirmUpdate()">下载更新</button>
  </div>
</template>

<script>

  import { ipcRenderer, shell } from 'electron'
  import os from 'os'

  export default {
    name: 'Update',
    data () {
      return {
        releaseNote: null,
        version: null,
        releaseName:null,
        updateTitle: null
      }
    },

    methods: {
      confirmUpdate() {
        if(os.platform() === 'win32'){
          ipcRenderer.send("confirm-update");
        }else {
          shell.openExternal(`https://github.com/CopyTranslator/CopyTranslator/releases/tag/v${this.version}`)
        }

      }
    },

    created () {
      ipcRenderer.on('releaseNote', (event, data) => {
        this.releaseNote = data.releaseNotes
        this.version = data.version
        this.releaseName = data.releaseName
      })
    }
  }
</script>

<style scoped>
  @import "~@/lib/css/milligram.min.css";
  #version {
    padding-top: 30px;
  }
  #releaseNote {
    text-align: left;
    font-size: 14px;
    padding-left: 30px;
  }


</style>
