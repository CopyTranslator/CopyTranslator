<template>
  <div>
    <StatusBar></StatusBar>

    <mu-button block to="/contrast">切换模式</mu-button>
    <mu-row>
      <hsc-menu-style-white style="width:100%" >
      <hsc-menu-context-menu style="width:100%" >
            <mu-text-field v-if="sharedResult" v-model="sharedResult.result"  multi-line :rows="4" full-width></mu-text-field>
            <template slot="contextmenu">
                <hsc-menu-item label="MenuItem 1" />
                <hsc-menu-item label="MenuItem 2" />
                <hsc-menu-item label="MenuItem 2">
                    <hsc-menu-item label="MenuItem 4" />
                    <hsc-menu-item label="MenuItem 5" />
                </hsc-menu-item>
            </template>
</hsc-menu-context-menu>
      </hsc-menu-style-white>
    </mu-row>
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
