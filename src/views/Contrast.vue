<template>
    <div>
      <StatusBar></StatusBar>
      <mu-text-field v-if="sharedResult" v-model="sharedResult.src"  multi-line :rows="8" full-width></mu-text-field>
    <mu-row justify-content="center" align-items="center">
      <mu-col span="4"><mu-button full-width color="primary">{{$t("translate")}}</mu-button></mu-col>
      <mu-col span="4"><mu-button full-width @click="changeMode('Focus')">{{$t("switchMode")}}</mu-button></mu-col>
      <mu-col span="4"><mu-button full-width @click="changeMode('Settings')">{{$t("settings")}}</mu-button></mu-col>
      </mu-row>
      <mu-row justify-content="center" align-items="center" @click="getLang">
      <mu-col span="6">
        <mu-select :label="$t('sourceLanguage')" full-width v-model="source" >
          <mu-option v-for="lang in languages"  :key="lang" :label="lang" :value="lang"></mu-option>
      </mu-select>
      </mu-col>  
      <mu-col span="6" >
        <mu-select :label="$t('targetLanguage')" full-width v-model="target" >
          <mu-option v-for="lang in languages"  :key="lang" :label="lang" :value="lang"></mu-option>
      </mu-select>
      </mu-col>
      </mu-row>
    <mu-text-field v-if="sharedResult" v-model="sharedResult.result"  multi-line :rows="8" full-width></mu-text-field>
    </div>
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
        this.languages = this.$controller.translator.getLanguages();
        this.loaded = true;
      }
    }
  }
};
</script>

<style scoped>
</style>
