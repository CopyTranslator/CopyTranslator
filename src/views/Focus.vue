<template>
  <div>
    <StatusBar></StatusBar>
    <v-btn block to="/contrast">切换模式</v-btn>
    <v-textarea style="height: 100%;" full-width
                auto-grow
                v-model="text"
                outline
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
      text: null
    };
  },
  methods: {
    show(src, result) {
      this.src = src;
    }
  },
  mounted: async function() {
    this.$ipcRenderer.on("news", () => {});
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
