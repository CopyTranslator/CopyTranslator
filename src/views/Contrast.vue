<template>
    <div v-on:contextmenu="openMenu('Focus')">
      <StatusBar></StatusBar>
      <div class="container">
        <div class="b">
      <mu-button full-width color="primary">{{$t("translate")}}</mu-button>
      <mu-button full-width @click="changeMode('Focus')">{{$t("switchMode")}}</mu-button>
      <mu-button full-width @click="changeMode('Settings')">{{$t("settings")}}</mu-button>
       <mu-select :label="$t('sourceLanguage')"  v-model="source" >
          <mu-option v-for="lang in languages"  :key="lang" :label="lang" :value="lang"></mu-option>
      </mu-select>
      <mu-select :label="$t('targetLanguage')" v-model="target" >
          <mu-option v-for="lang in languages"  :key="lang" :label="lang" :value="lang"></mu-option>
      </mu-select>
        </div>
        <div class="a">
          <textarea :style="area" v-if="sharedResult" v-model="sharedResult.src"></textarea>
     <textarea :style="area" v-if="sharedResult" v-model="sharedResult.result">
  
     </textarea>
     </div>
       
    </div>

    </div>
</template>

<script>
import StatusBar from "../components/StatusBar";
import BaseView from "./BaseView";
import WindowController from "../components/WindowController";
import Adjustable from "./Adjustable";
export default {
  name: "Contrast",
  mixins: [BaseView, WindowController, Adjustable],
  data: function() {
    return {
      loaded: false,
      size: this.$controller.config.values.contrast.fontSize
    };
  },
  computed: {
    area() {
      return `fontSize:${this.size.toString()}px;width:100%;height:45vh`;
    }
  },
  components: {
    StatusBar
  },
  mounted: function() {
    this.resize(null, this.$el.clientHeight);
    this.$nextTick(() => {
      this.languages = this.$controller.translator.getLanguages();
    });
  }
};
</script>

<style scoped>
.container {
  display: grid;
}
.a {
  grid-column: 1 / 4;
  grid-row: 1 / 2;
  background: blue;
}

.b {
  grid-column: 4/ 5;
  grid-row: 1 / 2;
  background: orange;
}
</style>
