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
      languages: this.$controller.translator.getLanguages(),
      source: this.$controller.source(),
      target: this.$controller.target(),
      isWord: false
    };
  },
  watch: {
    // 如果 sourceLanguage,targetLanguage 发生改变，这个函数就会运行
    source: function(newSource, oldSource) {
      this.$controller.setByKeyValue("sourceLanguage", newSource);
      if (this.routeName === "contrast") {
        this.translate();
      }
    },
    target: function(newTarget, oldTarget) {
      this.$controller.setByKeyValue("targetLanguage", newTarget);
      if (this.routeName === "contrast") {
        this.translate();
      }
    }
  }
};
</script>
