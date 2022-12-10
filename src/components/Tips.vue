<template>
  <div style="height: 100%; width: 100%;">
    <v-carousel
      v-model="tipIndex"
      height="300px"
      :cycle="true"
      :interval="10000"
    >
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
import { Component } from "vue-property-decorator";
import Base from "./Base.vue";

@Component
export default class Tips extends Base {
  tips: string[] = [];
  tipIndex: number = 0;

  getRandomInt(min: number, max: number): number {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); // The maximum is exclusive and the minimum is inclusive
  }

  mounted() {
    this.tips = [
      this.trans["<tooltip>welcome"],
      this.trans["textAdjustPrompt"],
      this.trans["googlePrompt"],
      this.trans["dragCopyTip"],
      this.trans["<tip>snapshot"],
      this.trans["<tip>focusSource"],
      this.trans["<tip>splitRatio"],
      this.trans["<tip>engineRight"],
      this.trans["<tip>multiSourceEngines"],
      this.trans["<tip>font"],
      this.trans["<tip>themeColor"],
      this.trans["<tip>transparency"],
      this.trans["<tip>penerate"],
      this.trans["<tip>titlebarHeight"],
      this.trans["<tip>engineCache"],
    ];
    this.tipIndex = this.getRandomInt(0, this.tips.length);
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
