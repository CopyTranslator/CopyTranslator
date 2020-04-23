<template>
  <div style="height: 100%;">
    <v-app>
      <div style="height: 80%; margin: 2%;">
        <v-tabs v-model="activeName">
          <v-tab>{{ trans["options"] }} </v-tab>
          <v-tab>{{ trans["switches"] }} </v-tab>
          <v-tab>{{ trans["ocrConfig"] }} </v-tab>
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
    Switches,
  },
})
export default class Focus extends Vue {
  activeName: string = "first";
  get trans() {
    return this.$store.getters.locale;
  }
}
</script>

<style scoped></style>
