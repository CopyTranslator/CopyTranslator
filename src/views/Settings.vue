<template>
  <div style="height:100%; margin: 10px">
    <div style="height:80%">
      <v-tabs v-model="activeName">
        <v-tab>{{ $t("options") }} </v-tab>
        <v-tab>{{ $t("switches") }} </v-tab>
        <v-tab>{{ $t("ocrConfig") }} </v-tab>
        <v-tab-item>
          <Options></Options>
        </v-tab-item>
        <v-tab-item>
          <Switches></Switches>
        </v-tab-item>
        <v-tab-item>
          <OCRConfig></OCRConfig>
        </v-tab-item>
      </v-tabs>
    </div>
  </div>
</template>

<script lang="ts">
import WindowController from "../components/WindowController.vue";
import { shell } from "electron";
import Options from "./Options.vue";
import OCRConfig from "./OCRConfig.vue";
import Switches from "./Switches.vue";
import { Mixins, Component } from "vue-property-decorator";

@Component({
  components: {
    Options,
    OCRConfig,
    Switches
  }
})
export default class Focus extends WindowController {
  activeName: string = "first";
}
</script>

<style scoped></style>
