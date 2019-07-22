<template>
  <div></div>
</template>

<script>
import { MessageType, WinOpt } from "../tools/enums";
import { ipcRenderer as ipc } from "electron";

export default {
  name: "Adjustable",
  data: function() {
    return {
      size: 20,
      windowHeight: window.innerHeight,
      windowWidth: window.innerWidth
    };
  },
  computed: {},
  methods: {
    setZoomFactor(value) {
      this.size -= value;
    },
    syncHeight() {
      this.windowHeight = window.innerHeight;
      this.windowWidth = window.innerWidth;
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
    window.addEventListener("resize", this.syncHeight);
  },
  destroyed() {
    window.removeEventListener("resize", this.syncHeight);
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped></style>
