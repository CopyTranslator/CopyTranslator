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
  props: ["engine"],
  data: function() {
    return {
      activeClass: ["btnBase"]
    };
  },
  computed: {},
  methods: {
    switchTranslator() {
      this.callback("translatorType|" + this.engine);
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
.Baidu {
  background-image: url("../images/baidu.svg");
}
.Google {
  background-image: url("../images/google.svg");
}
.Caiyun {
  background-image: url("../images/caiyun.png");
}
.Sogou {
  background-image: url("../images/sogou.svg");
}
.Youdao {
  background-image: url("../images/youdao.png");
}
.btnBase {
  background-position: center;
  background-size: contain;
}
</style>
