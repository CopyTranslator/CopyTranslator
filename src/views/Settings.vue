<template>
  <div style="height:100%; margin: 10px">
    <v-app>
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
    </v-app>
  </div>
</template>

<script lang="ts">
import { shell } from "electron";
import Options from "./Options.vue";
import OCRConfig from "./OCRConfig.vue";
import Switches from "./Switches.vue";
import { Mixins, Component, Vue } from "vue-property-decorator";

@Component({
  components: {
    Options,
    OCRConfig,
    Switches
  }
})
export default class Focus extends Vue {
  activeName: string = "first";
}
</script>

<style scoped></style>
