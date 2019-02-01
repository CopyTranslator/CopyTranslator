<template>
  <div>
    <StatusBar></StatusBar>
    <mu-button block to="/contrast">切换模式</mu-button>
    <mu-text-field v-if="sharedResult" v-model="sharedResult.result"  multi-line :rows="4" full-width></mu-text-field>
  </div>
</template>

<script>
import StatusBar from "../components/StatusBar";

export default {
  name: "FocusMode",
  components: { StatusBar },
  props: {
    msg: String
  },
  data: function() {
    return {};
  },
  computed: {
    sharedResult() {
      return this.$store.state.sharedResult;
    }
  },
  methods: {}
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
