<template>
  <div style="height:100%; margin: 10px">
    <div style="height:80%">
      <el-tabs v-model="activeName">
        <el-tab-pane :label="$t('options')" name="first">
          <Options></Options>
        </el-tab-pane>
        <el-tab-pane :label="$t('switches')" name="second">
          <Switches></Switches>
        </el-tab-pane>
        <el-tab-pane :label="$t('ocrConfig')" name="third">
          <OCRConfig></OCRConfig>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script lang="ts">
import WindowController from "../components/WindowController.vue";
import { shell } from "electron";
import Options from "./Options.vue";
import OCRConfig from "./OCRConfig.vue";
import Switches from "./Switches.vue";
import Component from "vue-class-component";
import { Mixins } from "vue-property-decorator";

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
