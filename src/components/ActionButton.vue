<template>
  <v-tooltip bottom open-delay="100" :disabled="(!tooltipText||!onContrast)">
    <template v-slot:activator="{ on, attrs }">
      <v-btn
        v-bind="attrs"
        v-on="on"
        color="primary"
        small
        depressed
        tile
        :outlined="config.transparency > 0.5 && onContrast"
        class="btn"
        :height="btnSize.height"
        :width="btnSize.width"
        @click="handle(left_click, true)"
        @contextmenu="handle(right_click, false)"
      >
        <v-icon :size="btnSize.font">{{ icon }}</v-icon>
      </v-btn>
    </template>
    <span>{{ tooltipText }}</span>
  </v-tooltip>
</template>

<script lang="ts">
import { Prop, Component, Mixins } from "vue-property-decorator";
import BaseView from "./BaseView.vue";
import bus from "../common/event-bus";
import { PredefinedActionButton } from "../common/types";

@Component({
  components: {},
})
export default class Action extends Mixins(BaseView) {
  @Prop({ default: undefined }) readonly icon!: string;
  @Prop({ default: undefined }) readonly left_click!: string;
  @Prop({ default: undefined }) readonly right_click!: string;
  @Prop({ default: undefined }) readonly tooltip!: string;
  @Prop({ default: undefined }) readonly predefined!: PredefinedActionButton;
  @Prop({ default: true }) readonly onContrast!: boolean;

  get tooltipText(): undefined | string {
    if (this.tooltip == undefined) {
      let descs = [];
      if (this.left_click != undefined) {
        descs.push(
          `${this.trans["left_click"]}${this.getActionName(this.left_click)}`
        );
      }
      if (this.right_click != undefined) {
        descs.push(
          `${this.trans["right_click"]}${this.getActionName(this.right_click)}`
        );
      }
      return descs.join("，");
    } else {
      if (this.trans[this.tooltip] != undefined) {
        return this.trans[this.tooltip];
      } else {
        return this.tooltip;
      }
    }
  }

  getActionName(name: string) {
    if (this.trans[name]) {
      return this.trans[name];
    } else {
      return name;
    }
  }

  handle(identifier: string | undefined, isLeft: boolean) {
    if (identifier == undefined) {
      return;
    }
    bus.at("dispatch", identifier);
  }

  get trans() {
    return this.$store.getters.locale;
  }

  get layoutType() {
    return this.config.layoutType;
  }

  get btnSize() {
    return {
      height: this.titlebarHeight,
      width: `${this.titlebarHeightVal + 8}px`,
      font: Math.ceil(this.titlebarHeightVal * 0.7),
    };
  }
}
</script>

<style scoped>
.btn {
  padding: 0px !important;
  min-width: 0px !important;
}
</style>
