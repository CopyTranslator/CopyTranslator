<template>
  <div>
    <div>
      <div :style="area2">
        <textarea
          class="contrastText div-inline"
          v-if="sharedResult"
          :style="area"
          v-model="sharedResult.src"
          v-on:contextmenu="openMenu('FocusText')"
        ></textarea>

        <textarea
          class="contrastText div-inline"
          :style="area"
          v-if="sharedResult"
          v-model="sharedResult.result"
          v-on:contextmenu="openMenu('FocusText')"
        ></textarea>
      </div>

      <div
        class="controlPanel div-inline"
        style="text-align: left;float:right; padding: 5px;"
      >
        <Action
          v-for="actionId in actionKeys"
          :identifier="actionId"
          :key="actionId"
        ></Action>
        <el-button
          type="primary"
          class="noMargin"
          @click="changeMode('Focus')"
          >{{ $t("switchMode") }}</el-button
        >
        <el-button type="primary" class="noMargin" @click="translate">{{
          $t("translate")
        }}</el-button>
        <el-button type="primary" class="noMargin" @click="toSetting">
          {{ $t("settings") }}
        </el-button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import BaseView from "../components/BaseView.vue";
import WindowController from "../components/WindowController.vue";
import Action from "../components/Action.vue";
import Component from "vue-class-component";
import { Mixins } from "vue-property-decorator";
import { Identifier } from "../tools/identifier";

@Component({
  components: {
    Action
  }
})
export default class Contrast extends Mixins(BaseView, WindowController) {
  size: number = 15;
  readonly routeName = "contrast";
  actionKeys: Identifier[] = [];

  mounted() {
    this.$proxy.get("contrast").then(res => {
      this.size = res.fontSize;
    });
    this.$proxy.getKeys("contrastOption").then(res => {
      this.actionKeys = res;
    });
  }

  get area() {
    return {
      fontSize: `${this.size.toString()}px`,
      height: `${this.windowHeight / 2 - 5}px`,
      margin: `0`,
      padding: `0`
    };
  }
  get area2() {
    return {
      width: `${this.windowWidth - 165}px`,
      float: "left"
    };
  }

  toSetting() {
    this.$proxy.handleAction("settings");
  }
}
</script>

<style scoped>
p {
  font-size: 14px;
}

.controlPanel {
  width: 150px;
}

.contrastText {
  width: 100%;
  padding: 0;
}

.contrast {
  /* 不能取名container，不要忘记之前的教训，因为有的contain class 是有width 限制的 */
  width: 100%;
}

.noMargin {
  margin-left: 0 !important;
  margin-top: 2px;
  width: 100%;
}

.div-inline {
  display: inline;
}
</style>
