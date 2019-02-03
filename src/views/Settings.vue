<template>
    <div>
      <StatusBar></StatusBar>
     
    </div>
</template>

<script>
import StatusBar from "../components/StatusBar";
import BaseView from "./BaseView";
export default {
  name: "Settings",
  mixins: [BaseView],
  data: function() {
    return { loaded: false };
  },
  components: {
    StatusBar
  },
  methods: {
    getLang() {
      if (!this.loaded) {
        this.languages = this.$store.state.languages;
        this.loaded = true;
      }
    }
  }
};
</script>

<style scoped>
</style>
