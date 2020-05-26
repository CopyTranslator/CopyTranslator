<template>
  <v-expansion-panels>
    <v-expansion-panel v-for="actionId in actionKeys" :key="actionId">
      <v-expansion-panel-header>{{ actionId }}</v-expansion-panel-header>
      <v-expansion-panel-content>
        <KeyConfig :identifier="actionId"></KeyConfig>
      </v-expansion-panel-content>
    </v-expansion-panel>
  </v-expansion-panels>
</template>

<script lang="ts">
import { shell } from "electron";
import { Component, Vue } from "vue-property-decorator";
import KeyConfig from "@/components/KeyConfig.vue";
import { Identifier } from "../common/types";

@Component({
  components: {
    KeyConfig,
  },
})
export default class apiConfig extends Vue {
  actionKeys: Identifier[] = [
    "baidu-ocr",
    "baidu-domain",
    "baidu",
    "google",
    "youdao",
    "sogou",
    "caiyun",
    "tencent",
  ];
  confirm() {
    // this.$proxy.setUpRecognizer(this.APP_ID, this.API_KEY, this.SECRET_KEY);
  }
  close() {}
  tutorial() {
    shell.openExternal("https://www.bilibili.com/video/av53888416/");
  }
  get trans() {
    return this.$store.getters.locale;
  }
}
</script>

<style scoped></style>
