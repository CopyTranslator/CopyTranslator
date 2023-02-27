<template>
  <div style="height: 100vh;">
    <v-app style="height: 100%;" v-bind:style="appStyle">
      <v-app-bar app color="primary" dark dense :height="titlebarHeight">
        <v-spacer style="height: 100%;">
          <div class="dragableDiv"></div>
        </v-spacer>
        <ActionButton
          icon="mdi-close"
          left_click="close|settings"
          :onContrast="false"
        ></ActionButton
      ></v-app-bar>
      <div
        class="setting"
        :style="settingStyle"
        @contextmenu="openMenu('snapshotManage')"
      >
        <v-tabs v-model="tab" vertical class="mytab">
          <v-tab href="#translation">{{ trans["translate"] }}</v-tab>
          <v-tab href="#appearance">{{ trans["appearance"] }}</v-tab>
          <v-tab href="#switches">{{ trans["switches"] }}</v-tab>
          <v-tab href="#apiConfig">{{ trans["apiConfig"] }}</v-tab>
          <v-tab href="#translatorConfig">
            {{ trans["translatorConfig"] }}
          </v-tab>
          <v-tab href="#listenClipboardConfig">{{
            trans["listenClipboardConfig"]
          }}</v-tab>
          <v-tab href="#dragCopyConfig">{{ trans["dragCopyConfig"] }}</v-tab>
          <v-tab href="#snapshotManage">{{ trans["snapshotManage"] }}</v-tab>
          <v-tab href="#actionButtons">{{ trans["actionButtons"] }}</v-tab>
          <v-tab>{{ trans["other"] }}</v-tab>
          <v-tab>{{ trans["about"] }}</v-tab>
          <v-tab-item value="translation">
            <Options optionType="translation"></Options>
          </v-tab-item>
          <v-tab-item value="appearance">
            <Options optionType="appearance"></Options>
          </v-tab-item>
          <v-tab-item value="switches">
            <Switches :cates="['basic', 'advance']"></Switches>
          </v-tab-item>
          <v-tab-item value="apiConfig">
            <Config></Config>
          </v-tab-item>
          <v-tab-item value="translatorConfig">
            <Options optionType="translatorGroups"></Options>
          </v-tab-item>
          <v-tab-item value="listenClipboardConfig">
            <BlackWhiteConfig optionName="listenClipboard"></BlackWhiteConfig>
          </v-tab-item>
          <v-tab-item value="dragCopyConfig">
            <BlackWhiteConfig optionName="dragCopy"></BlackWhiteConfig>
          </v-tab-item>
          <v-tab-item value="snapshotManage">
            <Options
              optionType="snapshotManage"
              :restoreButton="false"
            ></Options>
          </v-tab-item>
          <v-tab-item value="actionButtons">
            <ActionButtonConfig></ActionButtonConfig>
          </v-tab-item>
          <v-tab-item>
            <Options optionType="other" :restoreButton="false"></Options>
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
import "@/css/shared-styles.css";
import Options from "./Options.vue";
import Config from "./Config.vue";
import Switches from "./Switches.vue";
import BlackWhiteConfig from "./BlackWhiteConfig.vue";
import About from "./About.vue";
import { Component, Mixins } from "vue-property-decorator";
import BaseView from "@/components/BaseView.vue";
import ActionButton from "@/components/ActionButton.vue";
import ActionButtonConfig from "@/components/ActionButtonConfig.vue";
import bus from "@/common/event-bus";

@Component({
  components: {
    Options,
    Config,
    Switches,
    BlackWhiteConfig,
    About,
    ActionButton,
    ActionButtonConfig,
  },
})
export default class Settings extends Mixins(BaseView) {
  set tab(val) {
    this.$router.replace({ query: { ...this.$route.query, ...{ tab: val } } });
  }

  get tab() {
    return this.$route.query.tab || "translation";
  }

  get trans() {
    return this.$store.getters.locale;
  }

  get settingStyle() {
    return { "padding-top": `${this.titlebarHeightVal + 5}px` };
  }

  mounted() {
    bus.gon("setSettingTab", (tab: string) => {
      this.tab = tab;
    });
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
.setting {
  height: calc(100% - 5px);
  padding-right: 10px;
  padding-left: 10px;
  overflow: hidden;
}
.mytab {
  height: 100%;
}
.mytab >>> .v-window__container {
  height: 100%;
}
.mytab >>> .v-window-item {
  height: 100%;
  overflow: auto;
  margin-left: 5px;
  margin-right: 5px;
}
</style>
