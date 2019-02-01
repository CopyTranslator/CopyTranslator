<template>
    <div v-if="sharedResult">
      <StatusBar></StatusBar>
      <mu-text-field v-if="sharedResult" v-model="sharedResult.src"  multi-line :rows="4" full-width></mu-text-field>
    <mu-row>
      <mu-col span="3"><mu-button full-width color="primary">翻译</mu-button></mu-col>
      <mu-col span="3"><mu-button full-width to="/focus">切换模式</mu-button></mu-col>
      <mu-col span="3"><mu-button full-width >设置</mu-button></mu-col>
      <mu-col span="3">
        <mu-select full-width v-model="lang" >
          <mu-option v-for="lang in languages"  :key="lang" :label="lang" :value="lang"></mu-option>
      </mu-select>
      </mu-col>  
    </mu-row>
    <mu-text-field v-if="sharedResult" v-model="sharedResult.result"  multi-line :rows="4" full-width></mu-text-field>
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
      lang: undefined,
      languages: ["1", "2"]
    };
  }
};
</script>

<style scoped>
</style>
