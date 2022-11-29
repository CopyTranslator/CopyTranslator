<template>
  <div style="height: 100vh;">
    <v-app style="height: 100vh; overflow: hidden;" v-bind:style="appStyle">
      <v-app-bar app color="primary" dark dense height="40px"
        ><v-spacer style="height: 100%;">
          <div class="dragableDiv"></div> </v-spacer
        ><ActionButton
          icon="mdi-close"
          left_click="close|settings"
        ></ActionButton
      ></v-app-bar>
      <div
        style="
          height: 100%;
          margin-right: 10px;
          margin-left: 10px;
          margin-top: 45px;
        "
      >
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
            <Options optionType="translatorGroups"></Options>
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
import DragCopyConfig from "./DrogCopyConfig.vue";
import About from "./About.vue";
import { Component, Mixins } from "vue-property-decorator";
import BaseView from "@/components/BaseView.vue";
import ActionButton from "@/components/ActionButton.vue";

@Component({
  components: {
    Options,
    Config,
    Switches,
    DragCopyConfig,
    About,
    ActionButton,
  },
})
export default class Settings extends Mixins(BaseView) {
  activeName: string = "first";
  get trans() {
    return this.$store.getters.locale;
  }
}
</script>

<style scoped>
::-webkit-scrollbar {
  display: auto;
}
.dragableDiv {
  -webkit-app-region: drag;
  height: 100%;
  width: 100%;
}
</style>
