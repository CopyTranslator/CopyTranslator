<template>
    <div >
      <StatusBar></StatusBar>
      <mu-text-field v-if="sharedResult" v-model="sharedResult.src"  multi-line :rows="8" full-width></mu-text-field>
    <mu-row justify-content="center" align-items="center">
      <mu-col span="4"><mu-button full-width color="primary">{{$t("hello")}}</mu-button></mu-col>
      <mu-col span="4"><mu-button full-width @click="changeMode">切换模式</mu-button></mu-col>
      <mu-col span="4"><mu-button full-width >设置</mu-button></mu-col>
      </mu-row>
      <mu-row justify-content="center" align-items="center">
      <mu-col span="6">
        <mu-select label="Source" full-width v-model="source" >
          <mu-option v-for="lang in languages"  :key="lang" :label="lang" :value="lang"></mu-option>
      </mu-select>
      </mu-col>  
      <mu-col span="6">
        <mu-select label="Target" full-width v-model="target" >
          <mu-option v-for="lang in languages"  :key="lang" :label="lang" :value="lang"></mu-option>
      </mu-select>
      </mu-col>
      </mu-row>
    <mu-text-field v-if="sharedResult" v-model="sharedResult.result"  multi-line :rows="8" full-width></mu-text-field>
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
    },
    languages() {
      return this.$store.state.languages;
    }
  },
  data: function() {
    return {
      source: this.$controller.source,
      target: this.$controller.target
    };
  },
  watch: {
    // 如果 `question` 发生改变，这个函数就会运行
    source: function(newSource, oldSource) {
      this.$controller.source = newSource;
    },
    target: function(newTarget, oldTarget) {
      this.$controller.target = newTarget;
    }
  },
  methods: {
    changeMode() {
      this.$router.push({ name: "Focus" });
    },
    async getList() {}
  },
  mounted: function() {
    this.getList();
  }
};
</script>

<style scoped>
</style>
