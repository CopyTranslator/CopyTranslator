<template>
    <div></div>
</template>

<script>
import { MessageType } from "../tools/enums";
import { ipcRenderer } from "electron";
export default {
  name: "WindowController",
  methods: {
    minify(event) {
      ipcRenderer.send(MessageType.MinifyWindow.toString(), null);
    },
    bindDrag(event) {
      if (event.button === 0) {
        ipcRenderer.send(MessageType.DragWindow.toString(), {
          status: true,
          x: event.screenX,
          y: event.screenY
        });
      }
    }
  }
};
</script>
