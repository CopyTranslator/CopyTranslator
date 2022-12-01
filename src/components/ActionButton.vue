<template>
  <v-tooltip bottom open-delay="100" :disabled="!tooltipText">
    <template v-slot:activator="{ on, attrs }">
      <div v-bind="attrs" v-on="on">
        <v-btn
          color="primary"
          small
          depressed
          fab
          @click="handle(left_click, true)"
          @contextmenu="handle(right_click, false)"
        >
          <v-icon>{{ icon }}</v-icon>
        </v-btn>
      </div>
    </template>
    <span>{{ tooltipText }}</span>
  </v-tooltip>
</template>

<script lang="ts">
import { Prop, Component, Mixins } from "vue-property-decorator";
import BaseView from "./BaseView.vue";
import bus from "../common/event-bus";
import { layoutTypes, PredefinedActionButton } from "../common/types";

@Component({
  components: {},
})
export default class Action extends Mixins(BaseView) {
  @Prop({ default: undefined }) readonly icon!: string;
  @Prop({ default: undefined }) readonly left_click!: string;
  @Prop({ default: undefined }) readonly right_click!: string;
  @Prop({ default: undefined }) readonly tooltip!: string;
  @Prop({ default: undefined }) readonly predefined!: PredefinedActionButton;

  get tooltipText(): undefined | string {
    if (this.trans[this.tooltip] != undefined) {
      return this.trans[this.tooltip];
    } else {
      return this.tooltip;
    }
  }

  handle(identifier: string | undefined, isLeft: boolean) {
    if (identifier == undefined) {
      return;
    }
    if (identifier == "enumerateLayouts") {
      this.enumerateLayouts(true);
      return;
    }
    bus.at("dispatch", identifier);
  }

  get trans() {
    return this.$store.getters.locale;
  }

  enumerateLayouts(isLeft: boolean) {
    const index = layoutTypes.findIndex((x) => x === this.layoutType);
    let newIndex: number;
    if (isLeft) {
      newIndex = (index + 1) % layoutTypes.length;
    } else {
      newIndex = (index + layoutTypes.length - 1) % layoutTypes.length;
    }
    this.set("layoutType", layoutTypes[newIndex]);
  }

  get layoutType() {
    return this.config.layoutType;
  }
}
</script>

<style scoped></style>
