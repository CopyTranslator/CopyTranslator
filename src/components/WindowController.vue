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
    callback(cmd) {
      this.$proxy.handleAction(cmd);
    },
    changeMode(routerName) {
      this.$proxy.routeTo(routerName);
    },
    changeModeNoSave(routerName) {
      this.$router.push({ name: routerName });
    },
    minify(event) {
      this.windowOpt(WinOpt.Minify);
    },
    closeMe() {
      this.windowOpt(WinOpt.CloseMe);
    },
    close(event) {},
    openMenu(id = null) {
      this.$proxy.popup(id);
    },
    resize(w = null, h = null, x = null, y = null) {
      this.windowOpt(WinOpt.Resize, {
        h: h,
        w: w,
        x: x,
        y: y
      });
    },
    async storeWindow() {
      if (this.routeName) {
        this.$proxy.saveWindow(
          this.routeName,
          await this.$proxy.getBound(),
          this.size
        );
      }
    }
  },
  mounted: function() {
    ipc.on(MessageType.Router.toString(), (event, arg) => {
      this.changeModeNoSave(arg);
    });
    ipc.on(MessageType.WindowOpt.toString(), (event, arg) => {
      if (arg.type == WinOpt.SaveMode) {
        this.storeWindow();
      }
    });

    this.$nextTick(() => {
      ipc.send(MessageType.FirstLoaded.toString());
    });
    if (this.routeName) this.$proxy.restoreWindow(this.routeName);
  },
  destroyed: function() {
    this.storeWindow();
  }
};
</script>
