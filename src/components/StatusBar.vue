<template>
    <div class="draggable" v-on:dblclick="minify" v-on:mousedown="mouseDown" ></div>
</template>

<script>
import { MessageType } from "../tools/enums";
export default {
  name: "StatusBar",
  data: function() {
    return {};
  },
  methods: {
    minify(event) {
      this.$ipcRenderer.send(MessageType.MinifyWindow.toString(), null);
    },
    mouseDown(event) {
      if (event.button === 0) {
        this.$ipcRenderer.send(MessageType.DragWindow.toString(), {
          status: true,
          x: event.screenX,
          y: event.screenY
        });
      }
    }
  }
};
</script>

<style scoped>
.draggable {
  height: 15px;
  background: red;
}
</style>
