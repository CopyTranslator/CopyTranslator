<template>
    <div></div>
</template>

<script>
import { MessageType, WinOpt } from "../tools/enums";
import { ipcRenderer as ipc, webFrame, shell } from "electron";
export default {
  name: "WindowController",
  methods: {
    windowOpt(type, args = null) {
      ipc.send(MessageType.WindowOpt.toString(), {
        type: type,
        args: args
      });
    },
    changeMode(routerName) {
      this.$router.push({ name: routerName });
    },
    minify(event) {
      this.windowOpt(WinOpt.Minify);
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
    resize(w = null, h = null, x = null, y = null) {
      this.windowOpt(WinOpt.Resize, {
        h: h,
        w: w,
        x: x,
        y: y
      });
    }
  },
  mounted: function() {
    ipc.on(MessageType.Router.toString(), (event, arg) => {
      this.changeMode(arg);
    });
    ipc.on(MessageType.WindowOpt.toString(), (event, arg) => {
      switch (arg.type) {
        case WinOpt.OpenExternal:
          shell.openExternal(arg.args);
          break;
      }
    });
  }
};
</script>
