<template>
    <div v-if="sharedResult">
      <StatusBar></StatusBar>
      <!-- <v-textarea style="height: 100%;" full-width
                auto-grow
                v-model="sharedResult.src"
                outline
    ></v-textarea> -->
    <div>
      <v-btn >翻译</v-btn>
      <v-btn to="/focus">切换模式</v-btn>
      <v-btn >设置</v-btn>
      <v-select
          :items="languages"
          outline
        ></v-select>
    </div>
    <!-- <v-textarea style="height: 100%;" full-width
                auto-grow
                v-model="sharedResult.result"
                outline
    ></v-textarea> -->
    </div>
</template>

<script>
import StatusBar from "../components/StatusBar";
export default {
  name: "Contrast",
  components: {
    StatusBar
  },
  computed: {
    sharedResult() {
      return this.$store.state.sharedResult;
    }
  },
  data: () => {
    return {
      languages: ["1", "2"]
    };
  }
};
</script>

<style scoped>
</style>
