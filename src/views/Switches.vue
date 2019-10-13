<template>
  <div>
    <div v-on:dblclick="minify" style="text-align: left;">
      <div style="text-align: left;">
        <Action
          v-for="actionId in actionKeys"
          :identifier="actionId"
          :key="actionId"
        ></Action>
      </div>
    </div>
  </div>
</template>

<script>
import WindowController from "../components/WindowController";
import Action from "../components/Action";

export default {
  name: "Switches",
  mixins: [WindowController],
  data: function() {
    return {
      config: undefined,
      locale: undefined,
      locales: [],
      actionKeys: []
    };
  },
  mounted: function() {
    this.$proxy.getKeys("Switches").then(keys => {
      this.actionKeys = keys;
    });
    this.$proxy.getLocales("Switches").then(locales => {
      this.locales = locales;
    });
  },
  components: {
    Action
  },
  methods: {}
};
</script>

<style scoped></style>
