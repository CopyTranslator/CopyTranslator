<template>
  <div></div>
</template>

<script>
import { MessageType, WinOpt } from "../tools/enums";
import { ipcRenderer as ipc, webFrame } from "electron";

export default {
  name: "WindowController",
  data: function() {
    return {
      routeName: undefined
    };
  },
  methods: {
    windowOpt(type, args = null) {
      ipc.send(MessageType.WindowOpt.toString(), {
        type: type,
        args: args
      });
    },
    changeMode(routerName) {
      this.$controller.win.routeTo(routerName);
    },
    changeModeNoSave(routerName) {
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
    close(event) {},
    openMenu(id = null) {
      this.$controller.action.popup(id);
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
      this.changeModeNoSave(arg);
    });
    if (this.routeName) this.$controller.restoreWindow(this.routeName);
  },
  destroyed: function() {
    if (this.routeName) {
      this.$controller.saveWindow(
        this.routeName,
        this.$controller.win.getBound(),
        this.size
      );
    }
  }
};
</script>
