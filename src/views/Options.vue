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
  name: "Options",
  mixins: [WindowController],
  data: function() {
    return {
      config: undefined,
      locale: undefined,
      locales: this.$controller.locales.getLocales(),
      actionKeys: this.$controller.action.getKeys("Options")
    };
  },
  components: {
    Action
  },
  methods: {}
};
</script>

<style scoped></style>
