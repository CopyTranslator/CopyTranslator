<template>
  <div style="text-align: left; overflow: auto; height: 100%;">
    <Action :identifier="'enableOCR'"></Action>
    <v-card flat class="mt-4">
      <v-card-title class="subtitle-2 py-2">
        {{ trans["ocrSettings"] || "OCR 配置" }}
      </v-card-title>
      <v-card-text class="pt-0 pb-2">
        <v-expansion-panels multiple flat>
          <v-expansion-panel
            v-for="ocr in ocrList"
            :key="ocr.id"
          >
            <v-expansion-panel-header>
              <div class="d-flex align-center flex-grow-1 py-2">
                <div class="flex-grow-1 subtitle-2">{{ ocr.name }}</div>
              </div>
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              <v-card flat class="pa-3" style="background: #fafafa; border-radius: 4px;">
                <KeyConfig :identifier="ocr.id"></KeyConfig>
              </v-card>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-card-text>
    </v-card>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import Action from "@/components/Action.vue";
import KeyConfig from "@/components/KeyConfig.vue";
import { recognizerTypes } from "@/common/types";

@Component({
  components: {
    Action,
    KeyConfig,
  },
})
export default class OcrConfig extends Vue {
  ocrList: Array<{id: string; name: string}> = [];

  get trans() {
    return this.$store.getters.locale;
  }

  get availableRecognizers(): string[] {
    return recognizerTypes as unknown as string[];
  }

  mounted() {
    this.buildOcrList();
  }

  buildOcrList() {
    this.ocrList = this.availableRecognizers.map((id) => {
      return {
        id,
        name: this.getRecognizerName(id),
      };
    });
  }

  getRecognizerName(recognizerId: string): string {
    switch (recognizerId) {
      case "baidu-ocr":
        return this.trans["baidu-ocr"] || "百度 OCR";
      case "pp-ocr":
        return this.trans["pp-ocr"] || "PP-OCR";
      default:
        return recognizerId;
    }
  }
}
</script>

<style scoped></style>
