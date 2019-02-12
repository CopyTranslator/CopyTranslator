<template>
    <div></div>
</template>

<script>
import { MessageType, WinOpt } from "../tools/enums";
import { ipcRenderer as ipc } from "electron";
export default {
  name: "WindowController",
  methods: {
    windowOpt(type, args = null) {
      ipc.send(MessageType.WindowOpt.toString(), {
        type: type,
        args: args
      });
    },
    minify(event) {
      this.windowOpt(WinOpt.Minify);
      console.log("???");
    },
    bindDrag(event) {
      if (event.button === 0) {
        this.windowOpt(WinOpt.Drag, {
          status: true,
          x: event.screenX,
          y: event.screenY
        });
      }
    },
    openMenu(id = null) {
      this.$controller.menu.popup(id);
    },
    resize(w = null, h = null) {
      this.windowOpt(WinOpt.Resize, {
        h: h,
        w: w
      });
    }
  }
};
</script>
