<template>
  <div id="app">
    <v-app id="inspire">
      <v-app-bar app color="purple" dark>
        <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
        <v-text-field
          solo-inverted
          flat
          hide-details
          label="Search in text"
        ></v-text-field>
        <v-spacer></v-spacer>
      </v-app-bar>
      <v-navigation-drawer
        v-model="drawer"
        app
        disable-resize-watcher
        :permanent="drawer"
        hide-overlay
        :width="200"
      >
      </v-navigation-drawer>

      <HelloWorld
        style="margin-top:64px;"
        v-bind:class="{ active: drawer }"
      ></HelloWorld>
    </v-app>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import HelloWorld from "./components/HelloWorld.vue";

export default Vue.extend({
  name: "App",
  components: { HelloWorld },
  data: () => ({
    drawer: null,
    drawerRight: null,
    right: false,
    left: false
  })
});
</script>
<style>
.active {
  margin-left: 200px;
}
::-webkit-scrollbar {
  display: none;
}
</style>
