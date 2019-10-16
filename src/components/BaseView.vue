<template>
  <div></div>
</template>

<script lang="ts">
import { Watch, Component, Vue } from "vue-property-decorator";
import WindowController from "./WindowController.vue";
import { Language } from "@opentranslate/languages";
import { mixins } from "vue-class-component";

@Component
export default class BaseView extends mixins(WindowController) {
  source: Language = "en";
  target: Language = "zh-CN";

  get sharedResult() {
    return this.$store.state.sharedResult;
  }

  translate() {
    this.$proxy.tryTranslate(this.sharedResult.src, true);
  }

  mounted() {
    this.$proxy.get("sourceLanguage").then((source: Language) => {
      this.source = source;
    });
    this.$proxy.get("targetLanguage").then((target: Language) => {
      this.target = target;
    });
  }

  @Watch("source")
  sourceChanged(newSource: Language, oldSource: Language) {
    this.$proxy.set("sourceLanguage", newSource, true, true).then(() => {
      if (this.routeName === "contrast") {
        this.translate();
      }
    });
  }

  @Watch("target")
  targetChanged(newTarget: Language, oldTarget: Language) {
    this.$proxy.set("targetLanguage", newTarget, true, true).then(() => {
      if (this.routeName === "contrast") {
        this.translate();
      }
    });
  }
}
</script>
