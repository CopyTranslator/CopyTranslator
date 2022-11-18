<template>
  <div style="height: 100%;">
    <v-app style="height: 100%;">
      <div style="height: 100%; margin: 2%;">
        <v-tabs v-model="activeName" vertical>
          <v-tab>{{ trans["translate"] }}</v-tab>
          <v-tab>{{ trans["appearance"] }}</v-tab>
          <v-tab>{{ trans["switches"] }}</v-tab>
          <v-tab>{{ trans["apiConfig"] }}</v-tab>
          <v-tab>{{ trans["translatorConfig"] }}</v-tab>
          <v-tab>{{ trans["dragCopyConfig"] }}</v-tab>
          <v-tab>{{ trans["other"] }}</v-tab>
          <v-tab>{{ trans["about"] }}</v-tab>
          <v-tab-item>
            <Options optionType="translation"></Options>
          </v-tab-item>
          <v-tab-item>
            <Options optionType="appearance"></Options>
          </v-tab-item>
          <v-tab-item>
            <Switches :cates="['basic', 'advance']"></Switches>
          </v-tab-item>
          <v-tab-item>
            <Config></Config>
          </v-tab-item>
          <v-tab-item>
            <EngineManage></EngineManage>
          </v-tab-item>
          <v-tab-item>
            <DragCopyConfig></DragCopyConfig>
          </v-tab-item>
          <v-tab-item>
            <Options optionType="other"></Options>
          </v-tab-item>
          <v-tab-item>
            <About></About>
          </v-tab-item>
        </v-tabs>
      </div>
    </v-app>
  </div>
</template>

<script lang="ts">
import Options from "./Options.vue";
import Config from "./Config.vue";
import Switches from "./Switches.vue";
import EngineManage from "./EngineManage.vue";
import DragCopyConfig from "./DrogCopyConfig.vue";
import About from "./About.vue";
import { Component, Vue } from "vue-property-decorator";

@Component({
  components: {
    Options,
    Config,
    Switches,
    EngineManage,
    DragCopyConfig,
    About,
  },
})
export default class Settings extends Vue {
  activeName: string = "first";
  get trans() {
    return this.$store.getters.locale;
  }
}
</script>

<style scoped></style>
