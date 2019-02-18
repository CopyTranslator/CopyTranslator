<template>
  <div >
  </div>
</template>

<script>
import { MessageType, WinOpt } from "../tools/enums";
import { ipcRenderer as ipc } from "electron";
export default {
  name: "Adjustable",
  data: function() {
    return {
      size: 20,
      barHeight: 0
    };
  },
  computed: {},
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
    this.barHeight = this.$refs.bar.$el.clientHeight;
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
