<template>
  <div>
  <div class="draggable"></div>
    <v-textarea style="height: 100%;" full-width
            name="input-7-1"
                rows="30"
            v-model="text"
    ></v-textarea>
  </div>
</template>

<script>
import { ipcRenderer } from "electron";
export default {
  name: "FocusMode",
  props: {
    msg: String
  },
  data: function() {
    return {
      text: null,
      src: null,
      result: null
    };
  },
  methods: {
    checkBoard() {
      if (
        this.$clipboard.readText() === this.src ||
        this.$clipboard.readText() === this.result
      ) {
        console.log("返回");
        return;
      } else {
        console.log("翻译");
        this.doTranslate();
      }
    },
    doTranslate() {
      this.src = this.$clipboard.readText();
      console.log(this.src);
      this.$translate(
        {
          source: this.src
        },
        {
          to: "zh-cn"
        }
      )
        .then(res => {
          this.text = res.source;
          this.result = this.text;
        })
        .catch(err => {
          console.error(err);
        });
    }
  },
  mounted: async function() {
    this.interval = setInterval(() => {
      this.checkBoard();
    }, 1000);
    ipcRenderer.on("news", () => {});
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.draggable {
  height: 15px;
  -webkit-app-region: drag;
  background: red;
}
</style>
