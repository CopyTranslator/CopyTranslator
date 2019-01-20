<template>
  <div>
    <StatusBar></StatusBar>
    <v-textarea style="height: 100%;" full-width
                name="input-7-1"
                rows="30"
                v-model="text"
    ></v-textarea>
  </div>
</template>

<script>
import StatusBar from "../components/StatusBar";
export default {
  name: "FocusMode",
  components: { StatusBar },
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
    checkClipboard() {
      if (
        this.$clipboard.readText() === this.src ||
        this.$clipboard.readText() === this.result
      ) {
        return;
      } else {
        this.doTranslate();
      }
    },
    doTranslate() {
      this.src = this.$clipboard.readText();
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
      this.checkClipboard();
    }, 1000);
    this.$ipcRenderer.on("news", () => {});
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
