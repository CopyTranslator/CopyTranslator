<template>
    <hsc-menu-style-white>
      <StatusBar></StatusBar>
      
      <mu-text-field v-if="sharedResult" v-model="sharedResult.src"  multi-line :rows="8" full-width></mu-text-field>
    <mu-row justify-content="center" align-items="center">
      <mu-col span="4"><mu-button full-width color="primary">{{$t("hello")}}</mu-button></mu-col>
      <mu-col span="4"><mu-button full-width @click="changeMode('Focus')">切换模式</mu-button></mu-col>
      <mu-col span="4"><mu-button full-width >设置</mu-button></mu-col>
      </mu-row>
      <mu-row justify-content="center" align-items="center" @click="getLang">
      <mu-col span="6">
        <mu-select label="Source" full-width v-model="source" >
          <mu-option v-for="lang in languages"  :key="lang" :label="lang" :value="lang"></mu-option>
      </mu-select>
      </mu-col>  
      <mu-col span="6" >
        <mu-select label="Target" full-width v-model="target" >
          <mu-option v-for="lang in languages"  :key="lang" :label="lang" :value="lang"></mu-option>
      </mu-select>
      </mu-col>
      </mu-row>
    <mu-text-field v-if="sharedResult" v-model="sharedResult.result"  multi-line :rows="8" full-width></mu-text-field>
    </hsc-menu-style-white>
</template>

<script>
import StatusBar from "../components/StatusBar";
import BaseView from "./BaseView";
export default {
  name: "Contrast",
  mixins: [BaseView],
  data: function() {
    return { loaded: false };
  },
  components: {
    StatusBar
  },
  methods: {
    getLang() {
      if (!this.loaded) {
        this.languages = this.$store.state.languages;
        this.loaded = true;
      }
    }
  }
};
</script>

<style scoped>
</style>
