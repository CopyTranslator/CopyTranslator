<template>
  <div></div>
</template>

<script lang="ts">
import { Watch, Component, Vue, Mixins } from "vue-property-decorator";
import { Language } from "@opentranslate/languages";

@Component
export default class BaseView extends Vue {
  source: Language = "en";
  target: Language = "zh-CN";

  get sharedResult() {
    return this.$store.state.sharedResult;
  }

  get dictResult() {
    return this.$store.state.dictResult;
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
    this.$proxy.set("sourceLanguage", newSource, true, true);
  }

  @Watch("target")
  targetChanged(newTarget: Language, oldTarget: Language) {
    this.$proxy.set("targetLanguage", newTarget, true, true);
  }
}
</script>
