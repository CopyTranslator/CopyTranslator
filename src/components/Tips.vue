<template>
  <div style="height: 100%; width: 100%;">
    <v-carousel v-model="model" height="300px" :cycle="true" :interval="10000">
      <v-carousel-item v-for="(tip, i) in tips" :key="i">
        <v-sheet height="100%" tile>
          <div class="flex">
            <p style="margin: auto; text-align: center;">{{ tip }}</p>
          </div>
        </v-sheet>
      </v-carousel-item>
    </v-carousel>
  </div>
</template>

<script lang="ts">
import { translatorTypes, Identifier } from "../common/types";
import { Prop, Component, Vue } from "vue-property-decorator";
import bus from "../common/event-bus";

@Component
export default class Tips extends Vue {
  @Prop({ default: undefined }) readonly identifier!: Identifier;
  tips = [
    this.trans["<tooltip>welcome"],
    this.trans["textAdjustPrompt"],
    this.trans["googlePrompt"],
    this.trans["dragCopyTip"],
  ];
  model: number = this.getRandomInt(0, this.tips.length);

  callback(...args: any[]) {
    bus.at("dispatch", ...args);
  }

  get value() {
    return this.$store.state.config[this.identifier];
  }

  set value(val) {
    this.callback(this.identifier, val);
  }

  get trans() {
    return this.$store.getters.locale;
  }

  getRandomInt(min: number, max: number): number {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); // The maximum is exclusive and the minimum is inclusive
  }
}
</script>

<style scoped>
.flex {
  display: flex;
  /*实现垂直居中*/
  align-items: center;
  /*实现水平居中*/
  justify-content: center;
  text-align: justify;
  margin-left: 60px;
  margin-right: 60px;
  height: 100%;
}
</style>
