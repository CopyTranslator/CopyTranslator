<template>
  <div>
    <StatusBar></StatusBar>
    <div
      v-on:contextmenu="openMenu('Settings')"
      v-on:dblclick="minify"
      style="text-align: left;"
    >
      <div style="text-align: left;">
        <Action
          v-for="actionId in actionKeys"
          :action-id="actionId"
          :key="actionId"
        ></Action>
      </div>
      <el-button style="width:100%;" @click="backStored">{{
        $t("ApiConfig")
      }}</el-button>
      <el-button style="width:100%;" @click="backStored">{{
        $t("return")
      }}</el-button>
    </div>
  </div>
</template>

<script>
import StatusBar from "../components/StatusBar";
import WindowController from "../components/WindowController";
import Action from "../components/Action";

export default {
  name: "Settings",
  mixins: [WindowController],
  data: function() {
    return {
      config: undefined,
      locale: undefined,
      locales: this.$controller.locales.getLocales(),
      routeName: "settingsConfig",
      actionKeys: Object.keys(this.$controller.action.actions)
    };
  },
  components: {
    Action,
    StatusBar
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      if (from.name) vm.$controller.win.stored = from.name;
    });
  },
  methods: {
    backStored() {
      this.changeMode(this.$controller.win.stored);
    }
  }
};
</script>

<style scoped></style>
