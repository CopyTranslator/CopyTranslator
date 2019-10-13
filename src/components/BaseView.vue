<template>
  <div></div>
</template>

<script>
export default {
  name: "BaseView",
  computed: {
    sharedResult() {
      return this.$store.state.sharedResult;
    }
  },
  data: function() {
    return {
      languages: [],
      source: "en",
      target: "zh-CN",
      isWord: false
    };
  },
  mounted: function() {
    this.$proxy.getSupportLanguages().then(languages => {
      this.languages = languages;
    });
    this.$proxy.get("sourceLanguage").then(source => {
      this.source = source;
    });
    this.$proxy.get("targetLanguage").then(target => {
      this.target = target;
    });
  },
  watch: {
    // 如果 sourceLanguage,targetLanguage 发生改变，这个函数就会运行
    source: function(newSource, oldSource) {
      this.$proxy.set("sourceLanguage", newSource).then(() => {
        if (this.routeName === "contrast") {
          this.translate();
        }
      });
    },
    target: function(newTarget, oldTarget) {
      this.$proxy.set("targetLanguage", newTarget).then(() => {
        if (this.routeName === "contrast") {
          this.translate();
        }
      });
    }
  }
};
</script>
