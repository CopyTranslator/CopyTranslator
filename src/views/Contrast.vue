<template>
    <div v-on:contextmenu="openMenu('Contrast')">
      <StatusBar ref="bar"></StatusBar>
      <div class="contrast">
        <div>
          <textarea class="contrastText" v-if="sharedResult" :style="area"  v-model="sharedResult.src"></textarea>
     <textarea class="contrastText" :style="area" v-if="sharedResult" v-model="sharedResult.result">
     </textarea>
     </div>
        <div >
           <mu-select :label="$t('sourceLanguage')"  v-model="source" full-width >
          <mu-option v-for="lang in languages"  :key="lang" :label="lang" :value="lang"></mu-option>
      </mu-select>
      <mu-select :label="$t('targetLanguage')" v-model="target" full-width>
          <mu-option v-for="lang in languages"  :key="lang" :label="lang" :value="lang"></mu-option>
      </mu-select>
      <mu-button full-width color="primary" @click="translate">{{$t("translate")}}</mu-button>
      <mu-button full-width @click="changeMode('Focus')">{{$t("switchMode")}}</mu-button>
      <mu-button full-width @click="changeMode('Settings')">{{$t("settings")}}</mu-button>
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
      size: this.$controller.config.values.contrast.fontSize
    };
  },
  computed: {
    area() {
      return `fontSize:${this.size.toString()}px;width:100%;height:${(this
        .windowHeight -
        this.barHeight) /
        2}px`;
    }
  },
  components: {
    StatusBar
  },
  mounted: function() {
    this.$nextTick(() => {
      this.languages = this.$controller.translator.getLanguages();
    });
    this.barHeight = this.$refs.bar.$el.clientHeight;
  },
  methods: {
    translate() {
      this.$controller.tryTranslate(this.sharedResult.src);
    }
  }
};
</script>

<style scoped>
.contrast {
  /* 不能取名container，不要忘记之前的教训，因为有的contain class 是有width 限制的 */
  display: grid;
  grid-template-columns: 6fr 1fr;
  width: 100%;
}
</style>
