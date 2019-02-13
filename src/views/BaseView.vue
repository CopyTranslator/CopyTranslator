<template>
    <div>
    </div>
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
      source: this.$controller.source(),
      target: this.$controller.target()
    };
  },
  watch: {
    // 如果 source,target 发生改变，这个函数就会运行
    source: function(newSource, oldSource) {
      this.$controller.setByKeyValue("source", newSource);
    },
    target: function(newTarget, oldTarget) {
      this.$controller.setByKeyValue("target", newTarget);
    }
  }
};
</script>
