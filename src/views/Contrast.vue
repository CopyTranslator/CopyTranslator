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

<script>
import BaseView from "../components/BaseView";
import WindowController from "../components/WindowController";
import Adjustable from "../components/Adjustable";
import Action from "../components/Action";
import { RuleName } from "@/tools/rule";
export default {
  name: "Contrast",
  mixins: [BaseView, WindowController, Adjustable],
  data: function() {
    return {
      size: this.$controller.get("contrast").fontSize,
      routeName: "contrast",
      actionKeys: this.$controller.get("contrastOption")
    };
  },
  computed: {
    area() {
      return {
        fontSize: `${this.size.toString()}px`,
        height: `${this.windowHeight / 2 - 5}px`,
        margin: `0`,
        padding: `0`
      };
    },
    area2() {
      return {
        width: `${this.windowWidth - 165}px`,
        float: "left"
      };
    }
  },
  components: {
    Action
  },
  methods: {
    translate() {
      this.$controller.tryTranslate(this.sharedResult.src, true);
    },
    toSetting() {
      this.$controller.action.callback("settings");
    }
  }
};
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
