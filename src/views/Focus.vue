<template>
  <div>
    <StatusBar></StatusBar>
    <v-btn block to="/contrast">切换模式</v-btn>
    <v-textarea v-if="sharedResult" style="height: 100%;" full-width
                auto-grow
                v-model="sharedResult.result"
                outline
    ></v-textarea>
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
