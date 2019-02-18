<template>
    <div v-on:contextmenu="openMenu('Focus')" style="background:black;" ref="big">
      <StatusBar></StatusBar>
      <div class="contrast"  ref="container">
        <div class="a">
          <textarea :style="area" v-if="sharedResult" v-model="sharedResult.src"></textarea>
     <textarea :style="area" v-if="sharedResult" v-model="sharedResult.result">
  
     </textarea>
     </div>
        <div class="b">
      <mu-button full-width color="primary" @click="logs">{{$t("translate")}}</mu-button>
      <mu-button full-width @click="changeMode('Focus')">{{$t("switchMode")}}</mu-button>
      <mu-button full-width @click="changeMode('Settings')">{{$t("settings")}}</mu-button>
       <mu-select :label="$t('sourceLanguage')"  v-model="source" full-width >
          <mu-option v-for="lang in languages"  :key="lang" :label="lang" :value="lang"></mu-option>
      </mu-select>
      <mu-select :label="$t('targetLanguage')" v-model="target" full-width>
          <mu-option v-for="lang in languages"  :key="lang" :label="lang" :value="lang"></mu-option>
      </mu-select>
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
  },
  methods: {
    logs() {
      console.log(this.$refs.big);
      console.log(this.$refs.container);
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
  background: red;
}
.a {
  width: 100%;

  background: blue;
}

.b {
  margin-right: 0%;
  background: orange;
}
</style>
