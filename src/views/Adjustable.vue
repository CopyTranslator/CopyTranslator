<template>
  <div>
  </div>
</template>

<script>
import { MessageType, WinOpt } from "../tools/enums";
import { ipcRenderer as ipc } from "electron";
export default {
  name: "Adjustable",
  data: function() {
    return {
      size: 20
    };
  },
  computed: {
    fontSize() {
      return `fontSize:${this.size.toString()}px;width:100%;height:95vh`;
    }
  },
  methods: {
    setZoomFactor(value) {
      this.size -= value;
    }
  },
  mounted: function() {
    ipc.on(MessageType.WindowOpt.toString(), (event, arg) => {
      switch (arg.type) {
        case WinOpt.Zoom:
          this.setZoomFactor(arg.rotation);
          break;
      }
    });
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
