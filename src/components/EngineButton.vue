<template>
  <div class="engineBtn">
    <el-button
      v-bind:class="activeClass"
      class="baiduBtn"
      @click="switchTranslator"
      circle
    ></el-button>
  </div>
</template>

<script>
import WindowController from "./WindowController";
import { MessageType, WinOpt } from "../tools/enums";
import { ipcRenderer as ipc } from "electron";
const _ = import("lodash");

export default {
  name: "EngineButton",
  mixins: [WindowController],
  props: ["engine", "idx"],
  data: function() {
    return {
      activeClass: ["btnBase"]
    };
  },
  computed: {},
  methods: {
    switchTranslator() {
      this.callback("translatorType|" + this.idx.toString());
    }
  },
  mounted: function() {
    this.activeClass.push(this.engine);
  }
};
</script>

<style scoped>
.engineBtn {
  width: 100%;
  height: 100%;
}
.baidu {
  background-image: url("../images/baidu.svg");
}
.google {
  background-image: url("../images/google.svg");
}
.caiyun {
  background-image: url("../images/caiyun.png");
}
.sogou {
  background-image: url("../images/sogou.svg");
}
.youdao {
  background-image: url("../images/youdao.png");
}
.btnBase {
  background-position: center;
  background-size: contain;
}
</style>
