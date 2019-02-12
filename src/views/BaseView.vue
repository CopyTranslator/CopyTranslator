<template>
    <div>
    </div>
</template>

<script>
import { MessageType } from "../tools/enums";
import { ipcRenderer } from "electron";
export default {
  name: "BaseView",
  computed: {
    sharedResult() {
      return this.$store.state.sharedResult;
    }
  },
  data: function() {
    return {
      languages: [],
      source: this.$controller.source,
      target: this.$controller.target
    };
  },
  watch: {
    // 如果 source,target 发生改变，这个函数就会运行
    source: function(newSource, oldSource) {
      this.$controller.source = newSource;
    },
    target: function(newTarget, oldTarget) {
      this.$controller.target = newTarget;
    }
  },
  methods: {
    changeMode(routerName) {
      this.$router.push({ name: routerName });
    }
  },
  mounted: function() {
    ipcRenderer.on(MessageType.Router.toString(), (event, arg) => {
      this.changeMode(arg);
    });
  }
};
</script>
